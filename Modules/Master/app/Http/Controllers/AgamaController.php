<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Modules\Master\Agama;
use Modules\Master\Contracts\Services\AgamaServiceInterface;
use Modules\Master\Http\Requests\AgamaRequest;

class AgamaController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected readonly AgamaServiceInterface $agamaService)
    {
    }

    public function index()
    {
        $this->authorize('viewAny', Agama::class);

        return Inertia::render('Master::agamas/index', [
            'agamas' => $this->agamaService->getAgama(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Agama::class);

        return Inertia::render('Master::agamas/create', [
            'type' => 'create',
        ]);
    }

    public function getListAgama()
    {
        return response()->json([
            'data' => $this->agamaService->getListAgama()->items(),
            'pagination' => Arr::except($this->agamaService->getListAgama()->toArray(), 'data'),
        ]);
    }

    public function store(AgamaRequest $request)
    {
        $createAnother = boolval(request('create_another'));

        $validated = $request->validated();

        $route = $createAnother ? 'master.agama.create' : 'master.agama.index';

        return redirect()->route($route)->with('toast', $this->agamaService->save($validated));
    }

    public function show(Agama $agama)
    {
        $this->authorize('view', $agama);

        return Inertia::render('Master::agamas/show', [
            'type' => 'show',
            'agama' => $agama,
        ]);
    }

    public function edit(Agama $agama)
    {
        $this->authorize('update', $agama);

        return Inertia::render('Master::agamas/edit', [
            'type' => 'edit',
            'agama' => $agama,
        ]);
    }

    public function update(AgamaRequest $request, Agama $agama)
    {
        $validated = $request->validated();
        $redirectBack = boolval(request('redirect_back', false));

        if ($redirectBack) {
            return redirect()->back()->with('toast', $this->agamaService->update($agama, $validated));
        }

        return redirect()->route('master.agama.index')->with('toast', $this->agamaService->update($agama, $validated));
    }

    public function destroy(Agama $agama)
    {
        $this->authorize('delete', $agama);

        return redirect()->back()->with('toast', $this->agamaService->delete($agama));
    }

    public function destroyBulk(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        return redirect()->back()->with('toast', $this->agamaService->deleteBulk($validated));
    }
}
