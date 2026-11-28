<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEducationCategoryRequest;
use App\Http\Requests\Admin\UpdateEducationCategoryRequest;
use App\Models\EducationCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class EducationCategoryController extends Controller
{
    public function store(StoreEducationCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : $this->generateUniqueSlug($validated['name']);

        EducationCategory::query()->create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.education.index')
            ->with('status', 'Kategori edukasi berhasil ditambahkan.');
    }

    public function update(UpdateEducationCategoryRequest $request, EducationCategory $category): RedirectResponse
    {
        $validated = $request->validated();
        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : $this->generateUniqueSlug($validated['name'], $category->id);

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? $category->sort_order,
            'is_active' => $validated['is_active'] ?? $category->is_active,
        ]);

        return redirect()->route('admin.education.index')
            ->with('status', 'Kategori edukasi berhasil diperbarui.');
    }

    public function destroy(EducationCategory $category): RedirectResponse
    {
        if ($category->articles()->exists()) {
            return back()->withErrors([
                'category' => 'Kategori yang masih memiliki artikel tidak dapat dihapus.',
            ]);
        }

        $category->delete();

        return redirect()->route('admin.education.index')
            ->with('status', 'Kategori edukasi berhasil dihapus.');
    }

    private function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 2;

        while (
            EducationCategory::query()
                ->where('slug', $slug)
                ->when($ignoreId !== null, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
