<?php

namespace App\Services;

use App\Contracts\Services\HelperServiceInterface;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;
use ReflectionClass;

class HelperService implements HelperServiceInterface
{
    public function getListModel()
    {
        $cache = cache();
        $supportsTags = method_exists($cache->getStore(), 'tags');
        $key = 'models:list:v1';

        $remember = function () {
            $classes = [];

            foreach (File::allFiles(app_path()) as $file) {
                if ($file->getExtension() !== 'php') continue;

                $rel = $file->getRelativePathName(); // e.g. "Models/User.php"
                $class = sprintf(
                    '\\%s%s',
                    Container::getInstance()->getNamespace(), // usually "App\\"
                    strtr(substr($rel, 0, strrpos($rel, '.')), '/\\', '\\\\')
                );

                $classes[] = $class;
            }

            foreach (File::allFiles(app()->basePath('Modules')) as $file) {
                if ($file->getExtension() !== 'php') continue;

                $rel = $file->getRelativePathName(); // e.g. "Models/User.php"
                $class = sprintf(
                    '\\%s%s',
                    "Modules\\", // usually "App\\"
                    strtr(substr($rel, 0, strrpos($rel, '.')), '/\\', '\\\\')
                );

                $classes[] = str_replace('\\app', '', $class);
            }

            return collect($classes)
                ->unique()
                ->filter(function ($class) {
                    if (!class_exists($class)) return false;
                    $r = new ReflectionClass($class);
                    return $r->isSubclassOf(Model::class) && !$r->isAbstract();
                })
                ->map(function ($class) {
                    $r = new ReflectionClass($class);
                    return [
                        'value' => $r->getName(),
                        'label' => $r->getShortName(),
                    ];
                })
                ->values();
        };

        // Use tags when available; fall back to plain remember otherwise
        if ($supportsTags) {
            return $cache->tags('models')->remember($key, now()->addHours(12), $remember);
        }

        return $cache->remember($key, now()->addHours(12), $remember);
    }
}
