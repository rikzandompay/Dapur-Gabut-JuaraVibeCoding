# 📄 Product Requirements Document (PRD)

**Nama Proyek:** SAJIAN (Sistem AI Rekomendasi Masakan)
**Lead Developer / Pemilik Dokumen:** Rikzan El-yasinta
**Status:** In Progress
**Tanggal:** Mei 2026

## 1. Ringkasan Proyek (Project Overview)
SAJIAN adalah aplikasi berbasis web yang berfungsi untuk memberikan rekomendasi resep masakan secara cerdas menggunakan kecerdasan buatan (AI). Aplikasi ini dirancang untuk memecahkan masalah kebingungan harian pengguna saat ingin memasak namun hanya memiliki bahan makanan yang terbatas di kulkas atau dapur mereka.

## 2. Tujuan Proyek (Objectives)
*   **Efisiensi Waktu:** Membantu pengguna memutuskan menu masakan dalam hitungan detik.
*   **Mengurangi *Food Waste*:** Memaksimalkan penggunaan bahan makanan sisa yang ada di dapur.
*   **Pengalaman Ramah Pengguna:** Memberikan alur interaksi yang sangat singkat (2-Langkah) tanpa navigasi yang membingungkan.

## 3. Spesifikasi Teknologi (Tech Stack)
Aplikasi ini dibangun menggunakan arsitektur *Monorepo* yang memisahkan *frontend* dan *backend* untuk skalabilitas.

| Bagian | Teknologi / Framework | Fungsi Utama |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React), TypeScript, Bun | Mengatur UI/UX, *routing* (App Router), dan interaksi klien. |
| **Styling** | Tailwind CSS | *Slicing* antarmuka pengguna (UI). |
| **Backend** | Laravel (PHP) | Mengelola logika bisnis, API lokal, dan koneksi *database*. |
| **Database** | PostgreSQL / MySQL | Menyimpan data riwayat pencarian resep pengguna. |
| **Kecerdasan Buatan**| Google AI Studio API | Memproses input bahan dan menghasilkan teks resep (Bahan & Langkah). |

## 4. Fitur Utama (Core Features)
1.  **Input Bahan Pintar (Smart Ingredient Input):** 
    *   Pengguna dapat mengetik bahan makanan yang mereka miliki (contoh: "telur, nasi, bawang putih, sosis").
2.  **Rekomendasi AI (AI Recipe Generator):** 
    *   Sistem memproses input dan mengembalikan detail resep (Nama Masakan, Estimasi Waktu, Bahan Tambahan Opsional, dan Langkah Memasak).
3.  **Riwayat Resep (Recipe History):** 
    *   Semua resep yang pernah di-*generate* oleh AI akan disimpan ke dalam *database* dan bisa dilihat kembali pada halaman riwayat.

## 5. Alur Pengguna (User Flow)
Aplikasi ini menggunakan pendekatan "2-Langkah" agar sangat cepat digunakan:
*   **Langkah 1 (Beranda):** Pengguna masuk ke halaman utama ➔ Mengetik bahan makanan di kolom teks ➔ Klik tombol "Buat Resep".
*   **Langkah 2 (Hasil):** Muncul animasi *loading* singkat ➔ Halaman menampilkan hasil racikan resep dari AI ➔ Pengguna memiliki opsi untuk "Simpan Resep" atau "Coba Bahan Lain".

## 6. Struktur Database Awal (Database Schema)
Tabel utama yang dibutuhkan di Laravel (`recipes`):

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt / UUID | *Primary Key* (Otomatis). |
| `title` | String | Nama masakan yang dihasilkan AI. |
| `input_ingredients`| Text | Bahan baku yang diinputkan pengguna. |
| `full_ingredients` | Text / JSON | Daftar lengkap bahan yang direkomendasikan AI. |
| `instructions` | Text / JSON | Langkah-langkah memasak. |
| `cooking_time` | String | Estimasi waktu memasak (misal: "15 Menit"). |
| `created_at` | Timestamp | Waktu resep disimpan (Bawaan Laravel). |
| `updated_at` | Timestamp | Waktu resep diperbarui (Bawaan Laravel). |

## 7. Kriteria Kesuksesan (Success Metrics)
*   **Teknis:** Kecepatan respon API AI dari saat tombol ditekan hingga resep muncul kurang dari 5 detik.
*   **Operasional:** *Frontend* (Next.js) dan *Backend* (Laravel) dapat berkomunikasi melalui API lokal tanpa ada isu CORS (Cross-Origin Resource Sharing).