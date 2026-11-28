<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSystemSettingsRequest;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = SystemSetting::query()
            ->orderBy('group')
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin/PengaturanSistem', [
            'settings' => $settings,
            'groupedSettings' => $settings->groupBy('group'),
        ]);
    }

    public function update(UpdateSystemSettingsRequest $request): RedirectResponse
    {
        $adminId = $request->user()->id;

        foreach ($request->validated('settings') as $item) {
            $setting = SystemSetting::query()->where('key', $item['key'])->first();

            if ($setting === null) {
                continue;
            }

            $value = $item['value'] ?? null;

            $normalizedValue = match ($setting->type) {
                'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false',
                'integer' => (string) ((int) $value),
                'json' => is_string($value) ? $value : json_encode($value),
                default => $value === null ? null : (string) $value,
            };

            $setting->update([
                'value' => $normalizedValue,
                'updated_by' => $adminId,
            ]);
        }

        return redirect()->route('admin.settings.index')
            ->with('status', 'Pengaturan website berhasil disimpan.');
    }
}
