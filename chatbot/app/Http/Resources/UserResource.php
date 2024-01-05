<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'ID Korisnika: ' => $this->resource->id,
            'Ime: ' => $this->resource->name,
            'Elektronska posta: ' => $this->resource->email,
        ];

        if ($this->resource->isAdmin) {
            $data['Korisnicka uloga: '] = 'Ovaj korisnik je administrator.';
        }

        return $data;
    }
}
