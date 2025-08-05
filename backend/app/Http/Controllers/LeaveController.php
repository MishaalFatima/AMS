<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\Attendance;
use Carbon\Carbon;
use Twilio\Rest\Client;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;




class LeaveController extends Controller
{
    // POST /api/leaves
    public function store(Request $req)
    {
        $data = $req->validate([
            'startDate' => 'required|date|after_or_equal:today',
            'endDate'   => 'required|date|after_or_equal:startDate',
            'reason'    => 'required|string',
        ]);

        $leave = LeaveRequest::create([
            'user_id'    => $req->user()->id,
            'start_date'=> $data['startDate'],
            'end_date'  => $data['endDate'],
            'reason'    => $data['reason'],
            'status'    => 'pending',
        ]);

        // send WhatsApp alert to all admins
        try {
            $twilio = new Client(
                config('services.twilio.sid'),
                config('services.twilio.token')
            );

            // build a human‑friendly message
            $user    = $req->user();
            $message = "🚨 New Leave Request 🚨\n"
                     . "Student: {$user->UserName} ({$user->id})\n"
                     . "Dates: {$leave->start_date} → {$leave->end_date}\n"
                     . "Reason: {$leave->reason}\n"
                     . "Please review at Portal.";

            // fetch all admins (assumes you have a 'role' column)
                        

            $adminRole = Role::where('name', 'admin')->first();
            if ($adminRole) {
                $admins = User::where('role_id', $adminRole->id)
                ->whereNotNull('phone')
                ->get();
            } else {
                $admins = collect();
            }

            foreach ($admins as $admin) {
                if (! $admin->phone) {
                    continue; // skip if no WhatsApp number on file
                }
                $to = 'whatsapp:' . $admin->phone;

                $twilio->messages->create($to, [
                    'from' => config('services.twilio.from'),
                    'body' => $message,
                ]);
            }
        } catch (\Throwable $e) {
            // log and carry on; we don't want notification failures to block the API
            Log::error("Failed sending leave alert via WhatsApp: " . $e->getMessage());
        }

        // return the created leave request
        return response()->json($leave, 201);
    }

    // GET /api/leaves (Admin only)
    public function index()
    {
        return LeaveRequest::with('user')->orderBy('created_at','desc')->get();
    }

    // GET /api/leaves/my-requests (for students)
    public function myRequests(Request $req)
    {
        return LeaveRequest::where('user_id', $req->user()->id)
                     ->orderBy('created_at','desc')
                     ->get();
    }

    // PATCH /api/leaves/{id}/approve  (Admin only)
    public function approve(Request $req, $id)
    {
        $leave = LeaveRequest::findOrFail($id);

        // mark it approved
        $leave->status = 'approved';
        $leave->save();

        // for each day in the range, create an attendance record with status 'leave'
        $start = Carbon::parse($leave->start_date);
        $end   = Carbon::parse($leave->end_date);
        for ($date = $start; $date->lte($end); $date->addDay()) {
            Attendance::firstOrCreate(
                ['user_id' => $leave->user_id,
                 'marked_at' => $date->setTimeFromTimeString(now())],
                ['status' => 'leave']
            );
        }

        

        return response()->json($leave);
    }

    // PATCH /api/leaves/{id}/reject  (Admin only)
    public function reject(Request $req, $id)
    {
        $leave = LeaveRequest::findOrFail($id);
        $leave->status = 'rejected';
        $leave->save();

        return response()->json($leave);
    }
}
