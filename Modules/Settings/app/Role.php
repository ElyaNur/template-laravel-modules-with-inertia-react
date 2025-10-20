<?php

namespace Modules\Settings;

use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Modules\Settings\Observers\RoleObserver;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

#[ObservedBy([RoleObserver::class])]
class Role extends \Spatie\Permission\Models\Role
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable();
    }
}
