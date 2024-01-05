<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'ID chat-a: ' => $this->resource->id,
            'Datum i vreme: ' => $this->resource->timestamp,
            'Poruka: '=> $this->resource->message,
            'Odgovor: '=> $this->resource->response,
            'Poruku je poslao korisnik: '=> new UserResource($this->resource->user),
            'Poruka je poslata botu: '=> new BotManResource($this->resource->botMan),
        ];
    }
}
