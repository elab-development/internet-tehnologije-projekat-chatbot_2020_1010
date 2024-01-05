<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Resources\ChatHistoryResource;
use App\Models\ChatHistory;
use App\Models\BotMan as Bot;
use Illuminate\Support\Facades\Validator;

//BOTMAN
use BotMan\BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Drivers\DriverManager;



class ChatHistoryController extends Controller
{

    private function getBotmanInstance()
{
    // Your BotMan instance creation logic goes here
    $config = [
        'web' => [
            'matchingData' => [
                'driver' => 'web',
            ],
        ],
        'conversation_cache_time' => 40,
        'user_cache_time' => 30,
    ];

    DriverManager::loadDriver(\BotMan\Drivers\Web\WebDriver::class);

    return BotManFactory::create($config);
}

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
        'botman_id' => 'required',

    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors());
    }


    $chat_history = new ChatHistory();
    $chat_history->timestamp = $request->timestamp;
    $message = $chat_history->message = $request->message;

    $botman = $this->getBotmanInstance(); 
    
    if($message == 'Hello'){
        $botman->hears('Hello', function (BotMan $bot) {
            $bot->reply('Hello yourself.');
            $response = $bot->getMessage()->getText();
            $chat_history->user_id = $user_id;
            $chat_history->botman_id = $request->botman_id;
            $chat_history->save();
        });
    }
    
    if($message == 'What is your name?'){
        $botman->hears('What is your name?', function (BotMan $bot) {
            $chat_history->botman_id = $request->botman_id;
            $botman_name = (Bot::find($chatHistory->botman_id))->botman_name;
            $bot->reply('My name is '.$botman_name.'.');
            $response = $bot->getMessage()->getText();
            $chat_history->user_id = $user_id;
            
            $chat_history->save();
        });
    }

    if($message == 'What is your name?'){
        $botman->hears('What is the definition of an apple?', function (BotMan $bot) {
            $bot->reply('An apple is a type of edible fruit produced by an apple tree (Malus domestica).');
            $response = $bot->getMessage()->getText();
            $chat_history->user_id = $user_id;
            $chat_history->botman_id = $request->botman_id;
            $chat_history->save();
        });
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

        $chat_history = Chat::findOrFail($id);
        $chat_history->delete();
        return response()->json('Rekord datog chat-a uspesno obrisan!');
    }
}
