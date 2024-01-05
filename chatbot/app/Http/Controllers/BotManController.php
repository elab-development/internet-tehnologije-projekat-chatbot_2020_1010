<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Http\Resources\BotManResource;
use App\Models\BotMan;
use Illuminate\Support\Facades\Validator;

class BotManController extends Controller
{
    public function index()
    {
        $botman = BotMan::all();
        return BotManResource::collection($botman);
    }


    public function show($id)
    {
        $botman = BotMan::findOrFail($id);
        return new BotManResource($botman);
    }

    public function store(Request $request)
    {

    $validator = Validator::make($request->all(), [
        'botman_name' => 'required',
        'number_of_calls' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors());
    }


    $botman = new BotMan();
    $botman->botman_name = $request->botman_name;
    $botman->number_of_calls = $request->number_of_calls;

    $botman->save();

    return response()->json(['Uspesno je kreiran chatbot pod nazivom: '.$botman->botman_name.' !!!',
         new BotManResource($botman)]);
    }



    public function updateBotName(Request $request, $id)
     {
         $request->validate([
            'botman_name' => 'required',
         ]);

         $botman = BotMan::findOrFail($id);

         $botman->update(['botman_name' => $request->input('botman_name')]);

         return response()->json(['message' => 'Ime chatbot-a je uspesno izmenjeno.', new BotManResource($botman)]);
     }



    public function destroy($id)
    {
        $botman = botman::findOrFail($id);
        $botman->delete();
        return response()->json('Botman je uspesno obrisan!');
    }
}
