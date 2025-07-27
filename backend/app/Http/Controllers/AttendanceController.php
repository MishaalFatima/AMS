<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Twilio\Rest\Client;

class AttendanceController extends Controller
{
    /**
     * GET  /api/attendance/today
     *
     * Returns JSON: { marked: bool, timestamp: "…" }
     */
    public function today(Request $request)
    {
        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
                                ->whereDate('marked_at', $today)
                                ->first();

        return response()->json([
            'marked'    => (bool) $attendance,
            'timestamp' => $attendance?->marked_at,
        ], 200);
    }

    /**
     * POST /api/attendance
     *
     * - If not yet marked today → 201 + { marked: true, timestamp }
     * - If already marked     → 409 + { message, timestamp }
     */
    public function store(Request $request)
    {
        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $existing = Attendance::where('user_id', $user->id)
                              ->whereDate('marked_at', $today)
                              ->first();

        if ($existing) {
            return response()->json([
                'message'   => 'Attendance already marked for today.',
                'timestamp' => $existing->marked_at,
            ], 409);
        }

        $attendance = Attendance::create([
            'user_id'   => $user->id,
            'marked_at' => Carbon::now(),
        ]);

         try {
            // Phone must be in E.164 format, e.g. "+923001234567"
            $to = 'whatsapp:' . $user->phone;

            $client = new Client(
                config('services.twilio.sid'),
                config('services.twilio.token')
            );

            $message = "Hello {$user->name}, your attendance for "
                     . $attendance->marked_at->toDateString()
                     . " is recorded at "
                     . $attendance->marked_at->format('H:i')
                     . ".";

            $client->messages->create($to, [
                'from' => config('services.twilio.from'),
                'body' => $message,
            ]);
        } catch (\Throwable $e) {
            // Log but do not block the API response
            Log::error("WhatsApp send failed for user {$user->id}: {$e->getMessage()}");
        }

        return response()->json([
            'marked'    => true,
            'timestamp' => $attendance->marked_at,
        ], 201);
    }

    /**
     * GET /api/attendance/history
     *
     * Returns all attendance marks for the authenticated user, most recent first:
     * [
     *   { marked_at: "2025-07-11T08:23:00.000000Z" },
     *   { marked_at: "2025-07-10T09:15:00.000000Z" },
     *   …
     * ]
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $records = Attendance::where('user_id', $user->id)
                             ->orderBy('marked_at', 'desc')
                             ->get(['marked_at']);

        // Return as an array of simple objects
        return response()->json(
            $records->map(fn($rec) => [
                'marked_at' => $rec->marked_at,
            ])
        );
    }
    
    public function historyForUser(Request $request, $userId)
    {
        
        $records = Attendance::where('user_id', $userId)
        ->orderBy('marked_at', 'desc')
        ->get(['marked_at']);
        
        // Return as simple array of dates
         
        $history = $records->map(fn($r) => [
            'date' => $r->marked_at->toDateString(),
            'time' => $r->marked_at->toTimeString(),
        ]);
        
        return response()->json($history, 200);
    }

}
