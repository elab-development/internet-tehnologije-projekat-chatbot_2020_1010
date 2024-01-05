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
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze videti sve rekorde chat-ova!'], 403);
         }

        $chat_history = ChatHistory::all();
        return ChatHistoryResource::collection($chat_history);
    }


    public function show($id)
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze videti specifican rekord chat-a!'], 403);
         }

        $chat_history = ChatHistory::findOrFail($id);
        return new ChatHistoryResource($chat_history);
    }

    public function store(Request $request)
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if ($isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator ne moze pricati sa chatbotom!'], 403);
         }

    $validator = Validator::make($request->all(), [
        'timestamp' => 'required',
        'message' => 'required',
        'response' => 'required',
        'botman_id' => 'required',

    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors());
    }


    $chat_history = new ChatHistory();
    $chat_history->timestamp = $request->timestamp;
    $chat_history->message = $request->message;
    $chat_history->response = $request->response;
    $chat_history->user_id = $user_id;
    $chat_history->botman_id = $request->botman_id;

    $chat_history->save();

    return response()->json(['Chat je uspesno zabelezen!!!',
         new ChatHistoryResource($chat_history)]);
    }



    public function updateMessage(Request $request, $id)
     {
        $user_id = Auth::user()->id; 
        $chat_history_user_id = ChatHistory::where('id', $id)->value('user_id');

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if ($isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator ne moze menjati rekorde chat-ova!'], 403);
         }
         if($user_id != $chat_history_user_id){
            return response()->json(['error' => 'NEOVLASCEN PRISTUP: Korisnik nije ucestvovao u datom chat-u!'], 403);
         }

         $request->validate([
             'message' => 'required'
         ]);

         $chat_history = ChatHistory::findOrFail($id);

         $chat_history->update(['message' => $request->input('message')]);

         return response()->json(['message' => 'Poruka uspesno izmenjena, ali samim tim i odgovor.', new ChatHistoryResource($chat_history)]);
     }



    public function destroy($id)
    {
        $user_id = Auth::user()->id; 
        $chat_history_user_id = ChatHistory::where('id', $id)->value('user_id');

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if ($isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator ne moze brisati rekorde chat-ova!'], 403);
         }
         if($user_id != $chat_history_user_id){
            return response()->json(['error' => 'NEOVLASCEN PRISTUP: Korisnik nije ucestvovao u datom chat-u pa ga ne moze ni brisati!'], 403);
         }

        $chat_history = Chat::findOrFail($id);
        $chat_history->delete();
        return response()->json('Rekord datog chat-a uspesno obrisan!');
    }
}
