<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'input_ingredients',
        'full_ingredients',
        'instructions',
        'cooking_time',
        'is_saved',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'full_ingredients' => 'array',
            'instructions'     => 'array',
            'is_saved'         => 'boolean',
        ];
    }
}
