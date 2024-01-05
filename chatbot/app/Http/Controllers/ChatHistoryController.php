<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Resources\ChatHistoryResource;
use App\Models\ChatHistory;
use Illuminate\Support\Facades\Validator;

class ChatHistoryController extends Controller
{
    public function index()
    {
        $chat_history = ChatHistory::all();
        return ChatHistoryResource::collection($chat_history);
    }


    public function show($id)
    {
        $chat_history = ChatHistory::findOrFail($id);
        return new ChatHistoryResource($chat_history);
    }

    public function store(Request $request)
    {

    $validator = Validator::make($request->all(), [
        'timestamp' => 'required',
        'message' => 'required',
        'response' => 'required',
        'user_id' => 'required',
        'botman_id' => 'required',

    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors());
    }


    $chat_history = new ChatHistory();
    $chat_history->timestamp = $request->timestamp;
    $chat_history->message = $request->message;
    $chat_history->response = $request->response;
    $chat_history->user_id = $request->user_id;
    $chat_history->botman_id = $request->botman_id;

    $chat_history->save();

    return response()->json(['Chat je uspesno zabelezen!!!',
         new ChatHistoryResource($chat_history)]);
    }



    public function updateMessage(Request $request, $id)
     {
         $request->validate([
             'message' => 'required'
         ]);

         $chat_history = ChatHistory::findOrFail($id);

         $chat_history->update(['message' => $request->input('message')]);

         return response()->json(['message' => 'Poruka uspesno izmenjena, ali samim tim i odgovor.', new ChatHistoryResource($chat_history)]);
     }



    public function destroy($id)
    {
        $chat_history = Chat::findOrFail($id);
        $chat_history->delete();
        return response()->json('Rekord datog chat-a uspesno obrisan!');
    }
}
