<?php

namespace App\Http\Requests\Kader;

use App\Models\Child;
use App\Models\GrowthMeasurement;
use Illuminate\Foundation\Http\FormRequest;

class StoreGrowthMeasurementRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Child|null $child */
        $child = $this->route('child');

        return $child !== null && ($this->user()?->can('create', [GrowthMeasurement::class, $child]) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Child $child */
        $child = $this->route('child');

        return [
            'measured_at' => ['required', 'date', 'before_or_equal:today', 'after_or_equal:'.$child->birth_date->toDateString()],
            'weight_kg' => ['required', 'numeric', 'between:1.0,45.0'],
            'height_cm' => ['required', 'numeric', 'between:30.0,150.0'],
            'head_circumference_cm' => ['nullable', 'numeric', 'between:20.0,65.0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
