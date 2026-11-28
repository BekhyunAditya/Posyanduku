<?php

namespace App\Http\Requests\Kader;

use App\Enums\PosyanduActivityType;
use App\Models\PosyanduSchedule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePosyanduScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', PosyanduSchedule::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        foreach (['start_time', 'end_time'] as $field) {
            $value = $this->input($field);

            if (is_string($value) && strlen($value) === 8) {
                $this->merge([$field => substr($value, 0, 5)]);
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'activity_type' => ['required', Rule::enum(PosyanduActivityType::class)],
            'scheduled_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'location' => ['required', 'string', 'max:255'],
            'required_items' => ['nullable', 'array'],
            'required_items.*' => ['string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
