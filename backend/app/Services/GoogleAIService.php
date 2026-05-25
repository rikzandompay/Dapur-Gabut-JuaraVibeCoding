<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleAIService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey  = config('services.google_ai.api_key');
        $this->model   = config('services.google_ai.model', 'gemini-3.1-flash-lite');
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    /**
     * Generate 3 recipe suggestions (title + description + cooking_time only).
     *
     * @return array<int, array{title: string, description: string, cooking_time: string, difficulty: string}>
     */
    public function generateSuggestions(string $ingredients): array
    {
        $prompt = <<<PROMPT
Kamu adalah chef profesional Indonesia. Berdasarkan bahan-bahan berikut, buatkan TIGA ide resep masakan yang berbeda, kreatif, dan lezat.

Bahan yang tersedia: {$ingredients}

PENTING: Kamu WAJIB membalas HANYA dalam format JSON valid dengan struktur PERSIS seperti berikut:

{
  "suggestions": [
    {
      "title": "Nama masakan 1",
      "description": "Deskripsi singkat masakan dalam 1 kalimat",
      "cooking_time": "15 Menit",
      "difficulty": "Mudah"
    },
    {
      "title": "Nama masakan 2",
      "description": "Deskripsi singkat masakan dalam 1 kalimat",
      "cooking_time": "25 Menit",
      "difficulty": "Sedang"
    },
    {
      "title": "Nama masakan 3",
      "description": "Deskripsi singkat masakan dalam 1 kalimat",
      "cooking_time": "30 Menit",
      "difficulty": "Mudah"
    }
  ]
}

Aturan:
- Berikan TEPAT 3 resep berbeda yang realistis.
- Setiap resep harus memiliki nama kreatif dalam Bahasa Indonesia.
- "description" harus singkat, 1 kalimat, menjelaskan karakter masakan.
- "cooking_time" dalam format "X Menit".
- "difficulty" salah satu dari: "Mudah", "Sedang", atau "Sulit".
- Variasikan jenis masakan (misal: tumis, sup, goreng, kukus, dll).
PROMPT;

        $response = $this->callApi($prompt);

        $data = $this->parseJson($response);

        if (! isset($data['suggestions']) || ! is_array($data['suggestions'])) {
            throw new \RuntimeException('AI tidak mengembalikan saran resep. Coba lagi.');
        }

        return $data['suggestions'];
    }

    /**
     * Generate a full recipe for the selected title.
     *
     * @return array{title: string, input_ingredients: string, full_ingredients: array, instructions: array, cooking_time: string}
     */
    public function generateRecipe(string $ingredients, string $selectedTitle): array
    {
        $prompt = <<<PROMPT
Kamu adalah chef profesional Indonesia. Buatkan resep lengkap untuk masakan "{$selectedTitle}" menggunakan bahan-bahan berikut sebagai bahan utama.

Bahan yang tersedia: {$ingredients}

PENTING: Kamu WAJIB membalas HANYA dalam format JSON valid dengan struktur PERSIS seperti berikut:

{
  "title": "{$selectedTitle}",
  "full_ingredients": [
    {"qty": "jumlah", "item": "nama bahan"}
  ],
  "instructions": [
    "Langkah 1 yang detail dan jelas",
    "Langkah 2 yang detail dan jelas"
  ],
  "cooking_time": "estimasi waktu (contoh: 15 Menit)"
}

Aturan:
- "title": gunakan PERSIS nama "{$selectedTitle}".
- "full_ingredients": SEMUA bahan yang dibutuhkan (termasuk bumbu tambahan). Setiap item punya "qty" dan "item".
- "instructions": langkah memasak detail dalam Bahasa Indonesia. Minimal 4 langkah.
- "cooking_time": estimasi total waktu dalam format "X Menit".
- Pastikan resep realistis dan bisa dimasak di dapur rumah biasa.
PROMPT;

        $response = $this->callApi($prompt);

        $data = $this->parseJson($response);

        $requiredKeys = ['title', 'full_ingredients', 'instructions', 'cooking_time'];
        foreach ($requiredKeys as $key) {
            if (! isset($data[$key])) {
                throw new \RuntimeException("Resep AI tidak lengkap (missing: {$key}). Coba lagi.");
            }
        }

        return [
            'title'             => $data['title'],
            'input_ingredients' => $ingredients,
            'full_ingredients'  => $data['full_ingredients'],
            'instructions'      => $data['instructions'],
            'cooking_time'      => $data['cooking_time'],
        ];
    }

    /**
     * Call the Google AI API with retry logic.
     */
    private function callApi(string $prompt): array
    {
        $maxRetries = 2;
        $lastException = null;

        for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
            if ($attempt > 0) {
                sleep($attempt === 1 ? 2 : 5);
            }

            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->timeout(60)->post(
                    "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}",
                    [
                        'contents' => [
                            ['parts' => [['text' => $prompt]]],
                        ],
                        'generationConfig' => [
                            'responseMimeType' => 'application/json',
                            'temperature'      => 0.7,
                        ],
                    ]
                );

                if ($response->status() === 429) {
                    Log::warning('Google AI rate limit hit', ['attempt' => $attempt + 1]);
                    $lastException = new \RuntimeException('API AI sedang sibuk. Tunggu beberapa detik lalu coba lagi.');
                    continue;
                }

                if ($response->failed()) {
                    $errorBody = $response->json();
                    $errorMsg = $errorBody['error']['message'] ?? 'Unknown error';
                    Log::error('Google AI API failed', ['status' => $response->status(), 'error' => $errorMsg]);

                    if (str_contains($errorMsg, 'API_KEY_INVALID') || str_contains($errorMsg, 'API key not valid')) {
                        throw new \RuntimeException('API Key Google AI tidak valid. Periksa konfigurasi.');
                    }

                    throw new \RuntimeException('Gagal menghubungi Google AI: ' . $errorMsg);
                }

                return $response->json();

            } catch (\Illuminate\Http\Client\ConnectionException $e) {
                Log::error('Google AI connection error', ['error' => $e->getMessage()]);
                throw new \RuntimeException('Tidak dapat terhubung ke server Google AI.');
            }
        }

        throw $lastException ?? new \RuntimeException('Gagal menghubungi Google AI setelah beberapa percobaan.');
    }

    /**
     * Parse the Gemini response and extract JSON data.
     */
    private function parseJson(array $response): array
    {
        $text = $response['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (! $text) {
            Log::error('Google AI returned empty response', ['response' => $response]);
            throw new \RuntimeException('AI tidak mengembalikan data. Coba lagi.');
        }

        $text = preg_replace('/^```(?:json)?\s*/m', '', $text);
        $text = preg_replace('/\s*```$/m', '', $text);
        $text = trim($text);

        $data = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! $data) {
            Log::error('Failed to parse AI JSON', ['text' => $text]);
            throw new \RuntimeException('Gagal memproses respons AI. Coba lagi.');
        }

        return $data;
    }
}
