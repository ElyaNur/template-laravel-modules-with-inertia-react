<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ModuleMakeCrudCommand extends Command
{
    protected $signature = 'module:make-crud {module} {resource}';
    protected $description = 'Create a full CRUD interface for a resource within a module';

    private array $replacements = [];

    public function handle(): int
    {
        $module = $this->argument('module');
        $resource = $this->argument('resource');

        $this->prepareReplacements($module, $resource);
        $this->generateBackendFiles();
        $this->generateFrontendFiles();
        $this->addRoute();

        $this->info("CRUD for resource \"{$resource}\" has been successfully created in module \"{$module}\".");

        return 0;
    }

    private function prepareReplacements(string $module, string $resource): void
    {
        $this->replacements = [
            'module_name_pascal' => Str::studly($module),
            'module_name_kebab' => Str::kebab($module),
            'resource_name_pascal' => Str::studly($resource),
            'resource_name_camel' => Str::camel($resource),
            'resource_name_kebab' => Str::kebab($resource),
            'resource_name_plural_pascal' => Str::plural(Str::studly($resource)),
            'resource_name_plural_camel' => Str::plural(Str::camel($resource)),
            'resource_name_plural_kebab' => Str::plural(Str::kebab($resource)),
            'resource_name_plural_lowercase' => strtolower(Str::plural($resource)),
            'table_name' => Str::snake(Str::plural($resource)),
        ];
    }

    private function generateBackendFiles(): void
    {
        $this->info('Generating backend files...');

        $module = $this->replacements['module_name_pascal'];
        $resource = $this->replacements['resource_name_pascal'];

        Artisan::call('module:make-model', ['model' => $resource, 'module' => $module]);
        $this->info("- Model [{$resource}.php] created.");

        Artisan::call('module:make-migration', ['name' => "create_{$this->replacements['table_name']}_table", 'module' => $module]);
        $this->info("- Migration [create_{$this->replacements['table_name']}_table.php] created.");

        Artisan::call('module:make-controller', ['controller' => "{$resource}Controller", 'module' => $module, '--resource' => true]);
        $this->info("- Controller [{$resource}Controller.php] created.");

        Artisan::call('module:make-request', ['name' => "{$resource}Request", 'module' => $module]);
        $this->info("- Request [{$resource}Request.php] created.");

        // Create Service from stub
        $servicePath = base_path("Modules/{$module}/app/Services/{$resource}Service.php");
        $this->createFileFromStub('crud/service.stub', $servicePath);
        $this->info("- Service [{$resource}Service.php] created.");
    }

    private function generateFrontendFiles(): void
    {
        $this->info('Generating frontend files...');

        $module = $this->replacements['module_name_pascal'];
        $resourcePluralKebab = $this->replacements['resource_name_plural_kebab'];

        $basePath = base_path("Modules/{$module}/resources/js/Pages/{$resourcePluralKebab}");
        File::makeDirectory($basePath, 0755, true, true);
        File::makeDirectory("{$basePath}/hooks", 0755, true, true);

        $files = ['index', 'create', 'edit', 'show', 'cru', 'columns'];
        foreach ($files as $file) {
            $path = "{$basePath}/{$file}.tsx";
            $this->createFileFromStub("crud/{$file}.tsx.stub", $path);
            $this->info("- Frontend Page [{$file}.tsx] created.");
        }

        $hookPath = "{$basePath}/hooks/use-{$this->replacements['resource_name_kebab']}-table.ts";
        $this->createFileFromStub('crud/hooks/use-table.ts.stub', $hookPath);
        $this->info("- Frontend Hook [use-{$this->replacements['resource_name_kebab']}-table.ts] created.");
    }

    private function addRoute(): void
    {
        $this->info('Adding resource route...');

        $module = $this->replacements['module_name_pascal'];
        $resourcePluralKebab = $this->replacements['resource_name_plural_kebab'];
        $controller = "{$this->replacements['resource_name_pascal']}Controller";

        $route = "\nRoute::resource('{$resourcePluralKebab}', {$controller}::class);
";

        $routePath = base_path("Modules/{$module}/routes/web.php");
        File::append($routePath, $route);
        $this->info("- Route for \"{$resourcePluralKebab}\" added to web.php.");
    }

    private function createFileFromStub(string $stubPath, string $targetPath): void
    {
        $stub = File::get(base_path("stubs/{$stubPath}"));

        $content = str_replace(
            array_map(fn($key) => "{{ {$key} }}", array_keys($this->replacements)),
            array_values($this->replacements),
            $stub
        );

        File::put($targetPath, $content);
    }
}