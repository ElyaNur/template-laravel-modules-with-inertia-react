type LoaderMap = Record<string, () => Promise<Record<string, unknown>>>;

const pages: LoaderMap = {
    ...import.meta.glob('./Pages/**/*.tsx'),
    ...import.meta.glob('./Pages/**/*.jsx'),
    ...import.meta.glob('../../Modules/*/resources/js/pages/**/*.tsx'),
    ...import.meta.glob('../../Modules/*/resources/js/pages/**/*.jsx'),
};

const tryLoad = (candidates: string[]) => {
    for (const key of candidates) {
        const load = pages[key];
        if (load) return load().then((m) => m.default);
    }
    throw new Error('Page not found: ' + candidates.join(' | '));
};

export function resolveInertiaPage(name: string) {
    if (name.includes('::')) {
        const [moduleName, pagePath] = name.split('::') as [string, string];
        return tryLoad([
            `../../Modules/${moduleName}/resources/js/pages/${pagePath}.tsx`,
            `../../Modules/${moduleName}/resources/js/pages/${pagePath}.jsx`,
        ]);
    }
    return tryLoad([`./Pages/${name}.tsx`, `./Pages/${name}.jsx`]);
}
