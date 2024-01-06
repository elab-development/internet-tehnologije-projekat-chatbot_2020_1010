<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BotMan;
use App\Http\Resources\BotManResource;

use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function searchBotMan(Request $request)
    {
        $user_id = Auth::user()->id; 

        //ADMINISTRATOR
        $isAdmin = Auth::user()->isAdmin;

        if (!$isAdmin) {
             return response()->json(['error' => 'NEOVLASCEN PRISTUP: Administrator samo moze videti sve korisnike!'], 403);
         }
         
        $query = BotMan::query();

        //Pretrazuje se po imenu auta
        if ($request->has('botman_name')) {
            $query->where('botman_name', 'like', '%' . $request->input('botman_name') . '%');
        }

        //Paginacija samo auta koji zadovoljavaju uslov za botman_name
        $page = $request->input('page', 1);
        $perPage = 2;

        $botmans = $query->orderBy('botman_name')->paginate($perPage, ['*'], 'page', $page);

        if($botmans->isEmpty()){
            return response()->json(['message' => 'There arent any chatbots that match your search criteria.'], 404);
        }
        return response()->json(['Current page: ' => $botmans->currentPage(), 'Last page:' => $botmans->lastPage(),
         'Chtabots that match your search criteria:' => BotManResource::collection($botmans)], 200);
    }
}
