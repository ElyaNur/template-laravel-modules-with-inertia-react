<?php

namespace Modules\Settings;

use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Settings\Observers\MenuObserver;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

#[ObservedBy([MenuObserver::class])]
class Menu extends Model
{
    use HasFactory, SoftDeletes,LogsActivity;

    protected $table = 'menu';

    protected $fillable = [
        'parent_id',
        'nama',
        'sort',
        'is_active',
        'keterangan',
        'icon',
        'permissions',
        'models',
    ];

    protected function casts(): array
    {
        return [
            'aktif' => 'boolean',
            'permissions' => AsCollection::class,
            'models' => AsCollection::class,
        ];
    }

    protected $appends = ['nama_url', 'permissions_or_models', 'route'];

    public function subMenu(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id');
    }

    public function parentMenu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    #[Scope]
    public function active($query)
    {
        return $query->whereIsActive(true);
    }

    protected function nama(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => ucwords($value),
            set: fn ($value) => mb_strtolower($value),
        );
    }

    protected function namaUrl(): Attribute
    {
        return new Attribute(
            get: fn () => str_replace(' ', '-', mb_strtolower($this->nama)),
        );
    }

    protected function route(): Attribute
    {
        $route = $this->nama_url.'.'.'index';

        if ($this->parent_id !== null) {
            $route = $this->parentMenu->nama_url.'.'.$route;
        }

        if ($this->subMenu()->exists()) {
            $route = null;
        }

        return new Attribute(
            get: fn () => $route,
        );
    }

    protected function permissionsOrModels(): Attribute
    {
        return new Attribute(
            get: function () {
                $permissions = $this->permission?->map(
                    fn ($permission) => ['value' => $permission, 'type' => 'permission']
                ) ?? collect([]);
                $models = $this->model?->map(
                    fn ($model) => ['value' => $model, 'type' => 'model']
                ) ?? collect([]);

                return $permissions->merge($models);
            }
        );
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable();
    }
}
