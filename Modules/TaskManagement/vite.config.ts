import { defineConfig } from 'vite';
import path from 'path';

const moduleName = 'TaskManagement';
const modulePath = `Modules/${moduleName}`;

export const paths = [
    `${modulePath}/resources/js/app.tsx`,
];

export default defineConfig({
    resolve: {
        alias: {
            [`@/${moduleName}`]: path.resolve(__dirname, 'resources/js'),
        },
    },
});
