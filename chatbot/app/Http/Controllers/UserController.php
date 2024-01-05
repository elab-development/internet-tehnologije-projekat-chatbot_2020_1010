<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Resources\UserResource;
use App\Models\User;

use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze videti sve korisnike!'], 403);
         }

        $users = User::all();
        return UserResource::collection($users);
    }


    public function show($id)
    {

        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze videti odredjenog korisnika!'], 403);
         }


        $user = User::findOrFail($id);
        return new UserResource($user);
    }

    public function destroy($id)
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze obrisati korisnika!'], 403);
         }


        $user = User::findOrFail($id);
        $user->delete();
        return response()->json('Korisnik je uspesno obrisan!');
    }
}