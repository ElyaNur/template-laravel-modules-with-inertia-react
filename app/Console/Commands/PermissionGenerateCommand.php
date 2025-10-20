<?php

namespace App\Console\Commands;

use App\Contracts\Services\HelperServiceInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionException;
use Spatie\Permission\Models\Permission;

class PermissionGenerateCommand extends Command
{
    protected $signature = 'permission:generate {name? : The name of the model}';

    protected $description = 'Generate permission from policy file';

    /**
     * @throws ReflectionException
     */
    public function handle(): void
    {
        $model = $this->argument('name');
        if ($model) {
            $this->generatePermission($model);
        } else {
            $this->generateAllPermissionFromPoliciesFolder();
        }
    }

    /**
     * @throws ReflectionException
     */
    private function generatePermission($model): void
    {
        $model = 'App\\Models\\' . $model;
        if (!class_exists($model)) {
            $this->error("Model {$model} not found");

            return;
        }

        $policy = Gate::getPolicyFor($model);

        if ($policy === null) {
            $this->error("Policy for {$model} not found");

            return;
        }

        $this->generatePermissionFromModel($policy);
    }

    /**
     * @throws ReflectionException
     */
    public function generateAllPermissionFromPoliciesFolder(): void
    {
        $models = app(HelperServiceInterface::class)->getListModel();
        foreach ($models as $model) {
            $policy = Gate::getPolicyFor($model['value']);
            if ($policy === null) {
                $this->error("Policy for {$model['value']} not found");

                continue;
            }

            $this->generatePermissionFromModel($policy);
        }
    }

    /**
     * @throws ReflectionException
     */
    private function generatePermissionFromModel(object|string $policy): void
    {
        $this->comment('Generating permission from ' . $policy::class . ' policy');
        $methods = collect((new ReflectionClass($policy))->getMethods())
            ->pluck('name')
            ->filter(fn($method) => !in_array(
                $method,
                ['__construct', 'allow', 'deny', 'denyWithStatus', 'denyAsNotFound']
            ))
            ->map(fn($method) => [
                'name' => str_replace('-policy', '', Str::kebab(class_basename($policy))) . ':' . Str::kebab($method),
                'guard_name' => 'web',
            ])
            ->toArray();

        foreach ($methods as $method) {
            $this->info("Permission {$method['name']} created");
            Permission::updateOrCreate(['name' => $method['name']], $method);
        }
    }
}
