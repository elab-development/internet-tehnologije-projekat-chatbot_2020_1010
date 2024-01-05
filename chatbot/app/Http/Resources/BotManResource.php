<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BotManResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'Ime chatbot-a: ' => $this->resource->botman_name,
            'Broj poruka poslatih chatbotu: ' => $this->resource->number_of_calls,
        ];
    }
}
