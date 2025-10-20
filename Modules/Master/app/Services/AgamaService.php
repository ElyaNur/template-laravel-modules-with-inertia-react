<?php

namespace Modules\Master\Services;

use App\Services\ServiceWithSoftDelete;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Master\Agama;
use Modules\Master\Contracts\Services\AgamaServiceInterface;

final class AgamaService extends ServiceWithSoftDelete implements AgamaServiceInterface
{
    public function __construct()
    {
        parent::__construct(Agama::class);
    }

    public function getAgama(): LengthAwarePaginator
    {
        $filter = request('filter');
        $sort = request('sort');
        $withTrashed = request('withTrashed', 'without-trashed');

        return Agama::query()
            ->when(
                $filter,
                fn($query, $filter) => $query->whereAny([
                    'nama',
                ], 'ilike', "%$filter%")
            )
            ->when(
                $sort,
                function ($query, $sort) {
                    $exploded = explode(':', $sort);
                    $query->orderBy($exploded[0], $exploded[1]);
                },
                fn($query) => $query->orderByDesc('id')
            )
            ->when(
                $withTrashed !== 'without-trashed',
                fn($query) => $query
                    ->when(
                        $withTrashed === 'only-trashed',
                        fn($query) => $query->onlyTrashed(),
                        fn($query) => $query->withTrashed()
                    )
            )
            ->paginate(10);
    }

    public function getListAgama()
    {
        $filter = request('filter');

        return Agama::orderBy('nama')
            ->when(
                $filter,
                fn($query, $filter) => $query->whereAny([
                    'nama',
                ], 'ilike', "%$filter%")
            )
            ->paginate(20)
            ->through(fn(Agama $agama) => [
                'value' => $agama->id,
                'label' => $agama->nama,
            ]);
    }
}
