<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BotManController;
use App\Http\Controllers\ChatHistoryController;

use App\Http\Controllers\SearchController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//login i registracija
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

//Reset lozinke
Route::post('resetPassword',[AuthController::class,'resetPassword']);


Route::group(['middleware' => ['auth:sanctum']], function () {

    //ADMIN
    Route::get('chat_histories', [ChatHistoryController::class, 'index']);
    Route::get('chat_histories/{id}', [ChatHistoryController::class, 'show']); 

    Route::get('botman', [BotManController::class, 'index']);
    Route::get('botman/{id}', [BotManController::class, 'show']); 
    Route::post('botman', [BotManController::class, 'store']);
    Route::patch('botman/izmeniIme/{id}', [BotManController::class, 'updateBotName']);
    Route::delete('botman/{id}', [BotManController::class, 'destroy']);
    
    Route::resource('users', UserController::class);

    //SVAKO KO JE ULOGOVAN(SEM ADMINA)
    Route::post('chat_histories', [ChatHistoryController::class, 'store']);
    //pretraga Thread po imenu
    Route::get('/search/botmans', [SearchController::class, 'searchBotMan']);

    //ONAJ USER KOJI JE KREIRAO
    Route::delete('chat_histories/{id}', [ChatHistoryController::class, 'destroy']); 

    //LOGOUT
    Route::post('logout', [AuthController::class, 'logout']);
});
