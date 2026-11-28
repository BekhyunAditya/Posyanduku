<?php

namespace App\Http\Requests\Kader;

use App\Models\Child;
use App\Models\PosyanduVisit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePosyanduVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Child|null $child */
        $child = $this->route('child');

        return $child !== null && ($this->user()?->can('create', [PosyanduVisit::class, $child]) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Child $child */
        $child = $this->route('child');

        return [
            'posyandu_schedule_id' => [
                'nullable',
                'integer',
                Rule::exists('posyandu_schedules', 'id')->where('posyandu_id', $child->posyandu_id),
            ],
            'visited_at' => ['required', 'date', 'before_or_equal:today', 'after_or_equal:'.$child->birth_date->toDateString()],
            'attendance_status' => ['required', 'string', Rule::in(['hadir', 'izin', 'tidak_hadir'])],
            'services_provided' => ['nullable', 'array'],
            'services_provided.*' => ['string', 'max:100'],
            'service_notes' => ['nullable', 'string', 'max:2000'],
            'needs_follow_up' => ['sometimes', 'boolean'],
            'follow_up_notes' => [
                Rule::when(
                    $this->boolean('needs_follow_up'),
                    ['required', 'string', 'max:2000'],
                    ['nullable', 'string', 'max:2000'],
                ),
            ],
        ];
    }
}
