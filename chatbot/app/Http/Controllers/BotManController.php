<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Http\Resources\BotManResource;
use App\Models\BotMan;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Auth;

class BotManController extends Controller
{
    public function index()
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze videti sve chatbot-ove!'], 403);
         }

        $botman = BotMan::all();
        return BotManResource::collection($botman);
    }


    public function show($id)
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze videti specificnog chatbot-a!'], 403);
         }

        $botman = BotMan::findOrFail($id);
        return new BotManResource($botman);
    }

    public function store(Request $request)
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze kreirati novog chatbot-a!'], 403);
         }

    $validator = Validator::make($request->all(), [
        'botman_name' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors());
    }


    $botman = new BotMan();
    $botman->botman_name = $request->botman_name;
    $botman->number_of_calls = 0;

    $botman->save();

    return response()->json(['Uspesno je kreiran chatbot pod nazivom: '.$botman->botman_name.' !!!',
         new BotManResource($botman)]);
    }



    public function updateBotName(Request $request, $id)
     {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze menjati ime chatbot-a!'], 403);
         }

         $request->validate([
            'botman_name' => 'required',
         ]);

         $botman = BotMan::findOrFail($id);

         $botman->update(['botman_name' => $request->input('botman_name')]);

         return response()->json(['message' => 'Ime chatbot-a je uspesno izmenjeno.', new BotManResource($botman)]);
     }



    public function destroy($id)
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze obrisati chatbot-a!'], 403);
         }

        $botman = botman::findOrFail($id);
        $botman->delete();
        return response()->json('Botman je uspesno obrisan!');
    }
}
