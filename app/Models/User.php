<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'phone',
    'posyandu_id',
    'kader_verified_at',
    'is_active',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Default attribute values mirroring database defaults.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'role' => UserRole::OrangTua->value,
        'is_active' => true,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'kader_verified_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function posyandu(): BelongsTo
    {
        return $this->belongsTo(Posyandu::class);
    }

    public function children(): HasMany
    {
        return $this->hasMany(Child::class, 'parent_id');
    }

    public function recordedMeasurements(): HasMany
    {
        return $this->hasMany(GrowthMeasurement::class, 'kader_id');
    }

    public function recordedVisits(): HasMany
    {
        return $this->hasMany(PosyanduVisit::class, 'kader_id');
    }

    public function createdSchedules(): HasMany
    {
        return $this->hasMany(PosyanduSchedule::class, 'created_by');
    }

    public function consultationNotes(): HasMany
    {
        return $this->hasMany(ConsultationNote::class);
    }

    public function authoredArticles(): HasMany
    {
        return $this->hasMany(EducationArticle::class, 'author_id');
    }

    #[Scope]
    protected function active(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    #[Scope]
    protected function withRole(Builder $query, UserRole $role): Builder
    {
        return $query->where('role', $role);
    }

    public function hasRole(UserRole $role): bool
    {
        return $this->role === $role;
    }

    public function isOrangTua(): bool
    {
        return $this->hasRole(UserRole::OrangTua);
    }

    public function isKader(): bool
    {
        return $this->hasRole(UserRole::Kader);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(UserRole::Admin);
    }

    public function isVerifiedKader(): bool
    {
        return $this->isKader() && $this->kader_verified_at !== null;
    }

    public function dashboardRoute(): string
    {
        return ($this->role ?? UserRole::OrangTua)->dashboardRoute();
    }
}
