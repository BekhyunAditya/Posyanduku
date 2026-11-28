<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) ($this->user()?->is_active && $this->user()->isAdmin());
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var User $targetUser */
        $targetUser = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($targetUser->id)],
            'password' => ['nullable', 'string', Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'phone' => ['nullable', 'string', 'max:30'],
            'posyandu_id' => [
                Rule::when(
                    $this->input('role') === UserRole::Kader->value,
                    ['required', 'integer', 'exists:posyandus,id'],
                    ['nullable', 'integer', 'exists:posyandus,id'],
                ),
            ],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
