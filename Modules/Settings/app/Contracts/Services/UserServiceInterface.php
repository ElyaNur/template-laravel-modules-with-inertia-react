<?php

namespace Modules\Settings\Contracts\Services;

use App\Contracts\Services\ServiceInterface;
use App\Contracts\Services\WithSoftDeleteInterface;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserServiceInterface extends ServiceInterface, WithSoftDeleteInterface
{
    public function getUsers(): LengthAwarePaginator;
}
