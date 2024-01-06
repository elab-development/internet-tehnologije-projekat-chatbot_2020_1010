<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Resources\ChatHistoryResource;
use App\Models\ChatHistory;
use App\Models\BotMan;
use Illuminate\Support\Facades\Validator;


use Illuminate\Support\Facades\Auth;



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
        'message' => 'required',
        'botman_id' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors());
    }


    $chat_history = new ChatHistory();
    $chat_history->timestamp = now()->format('y-m-d H:i:s');;
    $message = $chat_history->message = $request->message;
    
    if($message == 'Hello.'){
            $response = 'Hello to you to!!!';
            $chat_history->response = $response;
            $chat_history->user_id = $user_id;
            
            $chat_history->botman_id = $request->botman_id;
            $botman = (BotMan::find($chat_history->botman_id));
            $botman->number_of_calls++;
            $botman->save();

            $chat_history->save();
        };

    
    if($message == 'What is your name?'){
            $chat_history->botman_id = $request->botman_id;
            $botman_name = (BotMan::find($chat_history->botman_id))->botman_name;
            $botman = (BotMan::find($chat_history->botman_id));
            $botman->number_of_calls++;
            $botman->save();
            $response = 'My name is '.$botman_name.'.';
            $chat_history->response = $response;
            $chat_history->user_id = $user_id;
            $chat_history->save();
        };

    if($message == 'What is the definition of an apple?'){
            $response = 'An apple is a type of edible fruit produced by an apple tree (Malus domestica).';
            $chat_history->response = $response;
            $chat_history->user_id = $user_id;
            $chat_history->botman_id = $request->botman_id;
            $botman = (BotMan::find($chat_history->botman_id));
            $botman->number_of_calls++;
            $botman->save();
            $chat_history->save();
        };


        if($message == 'Tell me a joke.'){
            $response = 'Your life.😎';
            $chat_history->response = $response;
            $chat_history->user_id = $user_id;
            $chat_history->botman_id = $request->botman_id;
            $botman = (BotMan::find($chat_history->botman_id));
            $botman->number_of_calls++;
            $botman->save();
            $chat_history->save();
        };

        //BROJI MI DO NEKOG BROJA
        if (preg_match('/^Count to (\d+)$/', $message, $matches)) {
            // Extract the number from the message
            $countTo = (int)$matches[1];
        
            // Generate a list of numbers from 1 to $countTo
            $numbers = implode(', ', range(1, $countTo));
        
            // Set the response
            $response = 'Counting to ' . $countTo . ': ' . $numbers;
            $chat_history->response = $response;
            $chat_history->user_id = $user_id;
            $chat_history->botman_id = $request->botman_id;
            $botman = (BotMan::find($chat_history->botman_id));
            $botman->number_of_calls++;
            $botman->save();
            $chat_history->save();

        } else {
            // Handle the case where the message doesn't match the pattern
            $response = 'Please provide a valid command, e.g., "Count to X".';
        }


    return response()->json(['Chat je uspesno zabelezen!!!',
         new ChatHistoryResource($chat_history)]);
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

        $chat_history = ChatHistory::findOrFail($id);
        $chat_history->delete();
        return response()->json('Rekord datog chat-a uspesno obrisan!');
    }
}
