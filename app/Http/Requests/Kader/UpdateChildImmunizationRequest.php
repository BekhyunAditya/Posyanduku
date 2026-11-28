<?php

namespace App\Http\Requests\Kader;

use App\Enums\ImmunizationStatus;
use App\Enums\VerificationStatus;
use App\Models\Child;
use App\Models\ChildImmunization;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateChildImmunizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ChildImmunization|null $immunization */
        $immunization = $this->route('immunization');

        return $immunization !== null && ($this->user()?->can('update', $immunization) ?? false);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Child $child */
        $child = $this->route('child');
        $birthDate = $child->birth_date->toDateString();

        return [
            'status' => ['required', Rule::enum(ImmunizationStatus::class)],
            'administered_at' => [
                Rule::when(
                    $this->input('status') === ImmunizationStatus::Recorded->value,
                    ['required', 'date', 'before_or_equal:today', 'after_or_equal:'.$birthDate],
                    ['nullable', 'date', 'before_or_equal:today', 'after_or_equal:'.$birthDate],
                ),
            ],
            'verification_status' => ['sometimes', Rule::enum(VerificationStatus::class)],
            'verified_by_name' => [
                Rule::when(
                    $this->input('verification_status') === VerificationStatus::VerifiedNakes->value,
                    ['required', 'string', 'max:255'],
                    ['nullable', 'string', 'max:255'],
                ),
            ],
            'location' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
