<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatHistory extends Model
{
    use HasFactory;

    protected $table = 'chat_histories';

    protected $fillable = ['user_id', 'botman_id', 'timestamp', 'message', 'response'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function botman()
    {
        return $this->belongsTo(BotMan::class);
    }
}
