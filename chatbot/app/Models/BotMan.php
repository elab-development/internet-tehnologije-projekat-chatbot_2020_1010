<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BotMan extends Model
{
    use HasFactory;

    protected $fillable = ['botman_name', 'number_of_calls'];


    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function chatHistories()
    {
        return $this->hasMany(ChatHistory::class);
    }

}
