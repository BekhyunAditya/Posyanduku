<?php

namespace App\Http\Requests\Ortu;

use App\Models\Child;
use App\Models\PosyanduSchedule;
use Illuminate\Foundation\Http\FormRequest;

class ToggleChecklistRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if ($user === null || ! $user->isOrangTua()) {
            return false;
        }

        $child = $this->filled('child_id')
            ? Child::query()->find($this->integer('child_id'))
            : null;

        if ($child === null || ! $user->can('view', $child)) {
            return false;
        }

        if ($this->filled('posyandu_schedule_id')) {
            $schedule = PosyanduSchedule::query()->find($this->integer('posyandu_schedule_id'));

            if ($schedule === null || ! $user->can('view', $schedule)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'child_id' => ['required', 'integer', 'exists:children,id'],
            'posyandu_schedule_id' => ['nullable', 'integer', 'exists:posyandu_schedules,id'],
            'checklist_template_id' => ['required', 'integer', 'exists:checklist_templates,id'],
            'is_completed' => ['required', 'boolean'],
        ];
    }
}
