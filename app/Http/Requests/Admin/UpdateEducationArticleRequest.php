<?php

namespace App\Http\Requests\Admin;

use App\Models\EducationArticle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEducationArticleRequest extends FormRequest
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
        /** @var EducationArticle $article */
        $article = $this->route('article');

        return [
            'education_category_id' => ['required', 'integer', 'exists:education_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique(EducationArticle::class)->ignore($article->id)],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'content' => ['required', 'string'],
            'thumbnail_url' => ['nullable', 'string', 'max:2048'],
            'min_age_months' => ['required', 'integer', 'min:0', 'max:60'],
            'max_age_months' => ['required', 'integer', 'min:0', 'max:60', 'gte:min_age_months'],
            'reading_time_minutes' => ['sometimes', 'integer', 'min:1', 'max:60'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
