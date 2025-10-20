<?php

namespace Modules\Master\Contracts\Services;

use App\Contracts\Services\ServiceInterface;
use App\Contracts\Services\WithSoftDeleteInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Master\Agama;

/**
 * @extends ServiceInterface<Agama>
 */
interface AgamaServiceInterface extends ServiceInterface, WithSoftDeleteInterface
{
    public function getAgama(): LengthAwarePaginator;

    public function getListAgama();
}
