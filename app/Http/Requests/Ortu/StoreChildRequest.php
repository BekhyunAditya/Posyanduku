<?php

namespace App\Http\Requests\Ortu;

use App\Enums\Gender;
use App\Models\Child;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Child::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $gender = $this->input('gender');

        if (is_string($gender)) {
            $normalized = match (mb_strtolower(trim($gender))) {
                'laki-laki', 'l' => Gender::Male->value,
                'perempuan', 'p' => Gender::Female->value,
                default => $gender,
            };

            $this->merge(['gender' => $normalized]);
        }

        if ($this->filled('posyandu_code')) {
            $this->merge([
                'posyandu_code' => strtoupper(trim((string) $this->input('posyandu_code'))),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['nullable', 'string', 'max:100'],
            'nik' => ['nullable', 'string', 'max:32'],
            'birth_date' => ['required', 'date', 'before_or_equal:today', 'after_or_equal:'.now()->subYears(6)->toDateString()],
            'gender' => ['required', Rule::enum(Gender::class)],
            'posyandu_id' => ['nullable', 'integer', Rule::exists('posyandus', 'id')->where('is_active', true)],
            'posyandu_code' => ['nullable', 'string', 'max:50', Rule::exists('posyandus', 'code')->where('is_active', true)],
            'birth_weight_kg' => ['nullable', 'numeric', 'between:0.5,8.0'],
            'birth_height_cm' => ['nullable', 'numeric', 'between:25,70'],
            'blood_type' => ['nullable', 'string', Rule::in(['A', 'B', 'AB', 'O'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
