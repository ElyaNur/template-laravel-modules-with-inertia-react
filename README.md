# Laravel Modules with Inertia.js (React & TypeScript) Template

[![Tests](https://github.com/ElyaNur/template-laravel-modules-with-inertia-react/actions/workflows/tests.yml/badge.svg)](https://github.com/ElyaNur/template-laravel-modules-with-inertia-react/actions/workflows/tests.yml)
[![Lint](https://github.com/ElyaNur/template-laravel-modules-with-inertia-react/actions/workflows/lint.yml/badge.svg)](https://github.com/ElyaNur/template-laravel-modules-with-inertia-react/actions/workflows/lint.yml)

Ini adalah sebuah template proyek yang dibangun di atas Laravel, menggunakan paket `nwidart/laravel-modules` untuk struktur aplikasi modular, dan diintegrasikan dengan `Inertia.js` untuk membangun antarmuka pengguna (UI) modern dengan React dan TypeScript.

## Latar Belakang

Paket `nwidart/laravel-modules` menyediakan cara yang luar biasa untuk mengorganisir aplikasi Laravel yang besar ke dalam modul-modul yang lebih kecil dan terkelola. Namun, paket tersebut tidak menyediakan integrasi langsung dengan tool-tool frontend modern seperti Inertia.js.

Repositori ini hadir untuk menjembatani kesenjangan tersebut. Kami telah melakukan konfigurasi awal yang diperlukan agar `Inertia.js`, `React`, `TypeScript`, dan `Vite` dapat bekerja secara mulus di dalam setiap modul yang Anda buat. Tujuannya adalah untuk mempercepat proses pengembangan bagi siapa saja yang ingin menggunakan arsitektur modular dengan stack frontend modern.

## Fitur Utama

- **Laravel 12**: Dibangun di atas versi terbaru dari framework Laravel.
- **Modular**: Menggunakan `nwidart/laravel-modules` untuk organisasi kode yang rapi.
- **Inertia.js**: Frontend modern tanpa perlu membangun API, dengan `React` dan `TypeScript`.
- **Vite**: Konfigurasi Vite yang sudah disesuaikan untuk me-load resource dari setiap modul secara otomatis.
- **Resolver Halaman Inertia**: Resolver kustom yang secara otomatis menemukan komponen halaman React (`.tsx`) dari dalam direktori `Modules`.
- **Styling**: Menggunakan Tailwind CSS (via `shadcn/ui`) untuk styling.
- **Linting & Formatting**: Sudah terkonfigurasi dengan ESLint dan Prettier untuk menjaga konsistensi kode.

## Panduan Instalasi

Berikut adalah langkah-langkah untuk menjalankan proyek ini di lingkungan lokal Anda.

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/your-username/template-laravel-modules-with-inertia-react.git
    cd template-laravel-modules-with-inertia-react
    ```

2.  **Install Dependensi PHP**
    ```bash
    composer install
    ```

3.  **Install Dependensi JavaScript**
    ```bash
    npm install
    ```

4.  **Buat File Environment**
    Salin file `.env.example` menjadi `.env`.
    ```bash
    cp .env.example .env
    ```

5.  **Generate Kunci Aplikasi**
    ```bash
    php artisan key:generate
    ```

6.  **Konfigurasi Database**
    Buka file `.env` dan sesuaikan konfigurasi database Anda (seperti `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

7.  **Jalankan Migrasi & Seeder**
    Perintah ini akan membuat tabel-tabel yang diperlukan di database Anda.
    ```bash
    php artisan migrate --seed
    ```

8.  **Jalankan Development Server**
    Proyek ini memerlukan dua proses server yang berjalan bersamaan: satu untuk backend Laravel dan satu untuk frontend Vite.

    - **Vite Dev Server** (di satu terminal):
      ```bash
      npm run dev
      ```
    - **Laravel Dev Server** (di terminal lain):
      ```bash
      php artisan serve
      ```

9.  **Selesai!**
    Buka aplikasi di `http://localhost:8000` (atau alamat yang ditampilkan oleh `php artisan serve`).

## Cara Penggunaan

### Membuat Modul Baru

Anda dapat membuat modul baru menggunakan perintah dari `nwidart/laravel-modules`:

```bash
php artisan module:make NamaModulAnda
```

Setelah modul dibuat, Anda perlu melakukan beberapa langkah konfigurasi frontend:

1.  **Buat `package.json`** di dalam direktori modul baru Anda (`Modules/NamaModulAnda/package.json`). Anda bisa menyalinnya dari modul `Dashboard` atau `Settings` sebagai contoh.

2.  **Buat `vite.config.ts`** di dalam direktori modul (`Modules/NamaModulAnda/vite.config.ts`). Ini penting agar Vite dapat mem-bundle aset dari modul Anda. Salin dari modul yang sudah ada dan sesuaikan path-nya.

3.  **Buat Struktur Direktori Frontend** di `Modules/NamaModulAnda/resources/js/`. Anda bisa membuat direktori `Pages`, `Components`, dll., sesuai kebutuhan.

Konfigurasi Vite utama di root proyek (`vite.config.ts`) secara otomatis akan mendeteksi dan memuat konfigurasi Vite dari setiap modul yang aktif.

### Resolver Halaman

Anda tidak perlu mendaftarkan halaman Inertia secara manual. Cukup letakkan file komponen halaman Anda (misalnya, `Index.tsx`) di dalam direktori `Modules/{NamaModul}/resources/js/Pages/`. Resolver kustom di `resources/js/page-resolver.ts` akan menemukannya secara otomatis.

Contoh di dalam Controller modul Anda:

```php
// Modules/NamaModul/app/Http/Controllers/NamaModulController.php

public function index()
{
    // Akan me-render Modules/NamaModul/resources/js/Pages/Index.tsx
    return inertia('Index');
}
```

## Perintah yang Berguna

- **Menjalankan Tes**:
  ```bash
  php artisan test
  ```

- **Linting & Formatting**:
  ```bash
  # Cek error linting
  npm run lint

  # Memperbaiki error linting secara otomatis
  npm run lint:fix

  # Memformat kode dengan Prettier
  npm run format
  ```
