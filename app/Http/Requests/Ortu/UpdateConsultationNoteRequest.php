<?php

namespace App\Http\Requests\Ortu;

use App\Models\ConsultationNote;
use Illuminate\Foundation\Http\FormRequest;

class UpdateConsultationNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ConsultationNote|null $note */
        $note = $this->route('consultationNote');

        return $note !== null && ($this->user()?->can('update', $note) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'posyandu_schedule_id' => ['nullable', 'integer', 'exists:posyandu_schedules,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'eating_pattern_notes' => ['nullable', 'string', 'max:2000'],
            'questions' => ['required', 'string', 'max:2000'],
            'follow_up_plan' => ['nullable', 'string', 'max:2000'],
            'noted_at' => ['nullable', 'date'],
        ];
    }
}
