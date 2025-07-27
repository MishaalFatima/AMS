<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;



class TaskController extends Controller
{
    // GET /api/tasks
    public function index()
    {
        return response()->json(Task::all());
    }

    // POST /api/tasks
    // Admin assigns task
    public function store(Request $request)
    {
        
        // Validate incoming dat
        $data = $request->validate([
            'student_id'  => 'required|exists:users,id',
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'due_date'    => 'required|date',
        ]);

        // Create the task
        $task = Task::create([
            'student_id'  => $data['student_id'],
            'title'       => $data['title'],
            'description' => $data['description'],
            'due_date'    => $data['due_date'],
            'status'      => 'pending',
        ]);

        // Send WhatsApp notification
        try {
            // Fetch the student
            $student = User::findOrFail($data['student_id']);

            if (! $student->phone) {
                throw new \Exception("No phone number on user {$student->id}");
            }

            // Initialize Twilio client
            $twilio = new Client(
                config('services.twilio.sid'),
                config('services.twilio.token')
            );

            // Build your message
            $msg = "📌 New Task Assigned 📌\n"
                 . "Title: {$task->title}\n"
                 . "Due:  " . (new \DateTime($task->due_date))->format('Y-m-d') . "\n\n"
                 . "Please submit by the due date.";

            // Send via WhatsApp
            $twilio->messages->create(
                'whatsapp:' . $student->phone,
                [
                    'from' => config('services.twilio.from'),
                    'body' => $msg,
                ]
            );
        } catch (\Throwable $e) {
            // Log and move on—don’t block task creation
            Log::error("WhatsApp task‑assign failed for user {$data['student_id']}: {$e->getMessage()}");
        }

        // Return the created task
        return response()->json($task, 201);
    
    }

    // GET /api/tasks/{task}
    public function show(Task $task)
    {
        return response()->json($task);
    }

     public function ownTasks(Request $request)
    {
        $user = $request->user();
        $own = Task::where('student_id', $user->id)
                   ->orderBy('due_date','asc')
                   ->get();

        return response()->json($own);
    }


    // POST /api/tasks/{task}/submit
    // Student uploads their file here
    public function submit(Request $request, Task $task)
    {
        $request->validate([
            'submission' => 'required|file|max:5120',
        ]);
        
        // Store the file under storage/app/public/submissions
        $path = $request
            ->file('submission')
            ->store('submissions', 'public');

            // Extract just the filename (e.g. "abc123.pdf") from the stored path
            $filename = basename($path);
            
            // Update the task with filename only
            $task->update([
                'submission_path' => $filename,
                'status'          => 'submitted',
            ]);
            
            return response()->json($task);
        
        }
        
        public function updateStatus(Request $request, Task $task)
        {
            $data = $request->validate([
                'status' => 'required|in:pending,submitted,approved,rejected',
            ]);
            
            $task->status = $data['status'];
            $task->save();

            try {
                
                // Fetch the student
                $student = User::findOrFail($task->student_id);
                
                if (! $student->phone) {
                    throw new \Exception("No phone number on user {$student->id}");
                }
                
                // Initialize Twilio client
                $twilio = new Client(
                    config('services.twilio.sid'),
                    config('services.twilio.token')
                );

                // Build your message
                 $label = ucfirst($data['status']); // e.g. "Approved" or "Rejected"
                 $emoji = $data['status'] === 'approved'
                 ? '✅'
                 : ($data['status'] === 'rejected' ? '❌' : '');

                $msg   = "📬 Task {$label} {$emoji}\n"
               . "Title: {$task->title}\n"
               . "Due:   " . $due = (new \DateTime($task->due_date))->format('Y-m-d') . "\n\n";

               if ($data['status'] === 'approved') {
                $msg .= "Great job! Your submission has been approved.";
            }
            elseif ($data['status'] === 'rejected') {
                $msg .= "Unfortunately, your submission was rejected. Please review and resubmit.";
            }
                
                // Dispatch the message
                $twilio->messages->create(
                    'whatsapp:' . $student->phone,
                    [
                        'from' => config('services.twilio.from'),
                        'body' => $msg,
                    ]
                );
            } catch (\Throwable $e) {
                // Log and move on—don’t block the response
                Log::error("WhatsApp status‑update failed for task {$task->id}: {$e->getMessage()}");
            }

            
            
            return response()->json($task);
        }
        
        // PATCH /api/tasks/{task}/status
        
        public function updateTask(Request $request, Task $task)
        {
            $data = $request->validate([
                'title'       => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'due_date'    => 'sometimes|required|date',
                'status'      => 'sometimes|required|in:pending,submitted,completed',
            ]);
            
            $task->update($data);
            
            return response()->json($task);
        }
        
        // DELETE /api/tasks/{task}
        public function destroy(Task $task)
        {
            $task->delete();
            return response()->noContent();
        }
}
