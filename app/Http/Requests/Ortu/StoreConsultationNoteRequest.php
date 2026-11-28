<?php

namespace App\Http\Requests\Ortu;

use App\Models\Child;
use App\Models\ConsultationNote;
use Illuminate\Foundation\Http\FormRequest;

class StoreConsultationNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if ($user === null) {
            return false;
        }

        $child = $this->filled('child_id')
            ? Child::query()->find($this->integer('child_id'))
            : null;

        return $user->can('create', [ConsultationNote::class, $child]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'child_id' => ['required', 'integer', 'exists:children,id'],
            'posyandu_schedule_id' => ['nullable', 'integer', 'exists:posyandu_schedules,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'eating_pattern_notes' => ['nullable', 'string', 'max:2000'],
            'questions' => ['required', 'string', 'max:2000'],
            'follow_up_plan' => ['nullable', 'string', 'max:2000'],
            'noted_at' => ['nullable', 'date'],
        ];
    }
}
