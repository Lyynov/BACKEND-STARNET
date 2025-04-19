# Sistem Manajemen ISP Star Access

![Sistem Manajemen ISP Star Access](https://via.placeholder.com/800x400.png?text=Star+Access+ISP+Management)

## 🚀 Gambaran Umum

Sistem Manajemen ISP Star Access adalah solusi komprehensif yang dirancang untuk Penyedia Layanan Internet (ISP) agar dapat mengelola pelanggan PPPoE, autentikasi RADIUS, router MikroTik, penagihan, voucher, dan pemantauan secara real-time dengan efisien. Sistem backend ini menyediakan API yang kuat untuk mendukung aplikasi web dan mobile untuk administrasi ISP.

## ✨ Fitur

- **Manajemen Router**: Melacak dan mengelola router dengan profil detail
- **Integrasi PPPoE**: Manajemen pengguna dan profil PPPoE secara lengkap
- **Autentikasi RADIUS**: Autentikasi aman melalui protokol RADIUS
- **Integrasi MikroTik**: Integrasi API langsung dengan router MikroTik
- **Sistem Penagihan**: Membuat dan melacak faktur serta pembayaran
- **Sistem Voucher**: Membuat dan mengelola voucher internet prabayar
- **Pemantauan Real-time**: Melacak penggunaan bandwidth, sumber daya server, dan sesi aktif
- **Pelaporan**: Menghasilkan laporan bisnis dan teknis yang komprehensif
- **Administrasi Multi-Pengguna**: Kontrol akses berbasis peran untuk staf

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki hal-hal berikut yang sudah terpasang:

- Node.js (v18.x atau lebih baru)
- PostgreSQL (v14.x atau lebih baru)
- Redis (v6.x atau lebih baru)
- FreeRADIUS (v3.x)
- Docker & Docker Compose (opsional tapi direkomendasikan)
- Router MikroTik dengan akses API yang diaktifkan

## 🛠️ Instalasi

### Menggunakan Docker (Direkomendasikan)

1. Kloning repositori:
   ```bash
   git clone https://github.com/yourusername/backend-starnet.git
   cd backend-starnet
   ```

2. Salin file environment:
   ```bash
   cp .env.example .env
   ```

3. Perbarui file `.env` dengan konfigurasi spesifik Anda

4. Mulai container:
   ```bash
   docker-compose up -d
   ```

5. API akan tersedia di `http://localhost:3000/api`
   dan dokumentasi Swagger di `http://localhost:3000/api/docs`

### Instalasi Manual

1. Kloning repositori:
   ```bash
   git clone https://github.com/yourusername/backend-starnet.git
   cd backend-starnet
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Salin file environment:
   ```bash
   cp .env.example .env
   ```

4. Perbarui file `.env` dengan konfigurasi Anda

5. Siapkan database PostgreSQL:
   ```bash
   psql -U postgres
   CREATE DATABASE star_access;
   exit
   ```

6. Jalankan migrasi database:
   ```bash
   npm run migration:run
   ```

7. Inisialisasi konfigurasi RADIUS:
   ```bash
   npm run setup:radius
   ```

8. Jalankan aplikasi:
   ```bash
   npm run start:dev
   ```

## 📊 Struktur Database

Sistem ini menggunakan PostgreSQL sebagai database utama dengan skema berikut:

- **users**: Admin dan pengguna sistem
- **customers**: Data Pelanggan PPPoE
- **pppoe_profiles**: Profil koneksi PPPoE
- **pppoe_users**: Pengguna PPPoE yang terhubung ke profil
- **vouchers**: Voucher internet prabayar
- **invoices & invoice_items**: Faktur dan detail item
- **payments**: Riwayat pembayaran
- **packages**: Paket layanan yang ditawarkan
- **routers**: Informasi router MikroTik
- **resource_usage & traffic_data**: Data monitoring

## 📡 Integrasi dengan MikroTik

1. Aktifkan API di router MikroTik:
   - Buka Winbox/WebFig
   - Buka menu IP → Services
   - Aktifkan "API" dan atur port (biasanya 8728)
   - Atur IP yang diizinkan untuk mengakses API

2. Tambahkan router di sistem:
   - Gunakan endpoint `/api/mikrotik/routers` untuk menambahkan router
   - Berikan informasi koneksi dengan benar (IP, username, password, port)

## 🔄 Integrasi dengan RADIUS

1. Pastikan server FreeRADIUS berjalan:
   ```bash
   sudo systemctl status freeradius
   ```

2. File konfigurasi RADIUS berada di `/configs/radius/`

3. Periksa koneksi RADIUS:
   ```bash
   npm run test:radius
   ```

## 🧑‍💻 Pengembangan

### Menjalankan dalam Mode Development

```bash
npm run start:dev
```

### Linting dan Formatting

```bash
npm run lint
npm run format
```

### Menjalankan Test

```bash
npm run test
npm run test:e2e
```

### Membangun untuk Produksi

```bash
npm run build
```

## 📱 Akses API

- API URL: `http://localhost:3000/api`
- Dokumentasi Swagger: `http://localhost:3000/api/docs`
- Ganti token JWT melalui header: `Authorization: Bearer <token>`

## 🔧 Pemecahan Masalah

### Masalah Koneksi Database
- Periksa kredensial database di file `.env`
- Pastikan server PostgreSQL berjalan
- Periksa log aplikasi untuk detail kesalahan

### Masalah Koneksi MikroTik
- Pastikan API diaktifkan di router
- Verifikasi IP, username, dan password
- Periksa firewall yang mungkin memblokir koneksi

### Masalah Koneksi RADIUS
- Pastikan server FreeRADIUS berjalan
- Periksa konfigurasi di `/configs/radius/`
- Verifikasi shared secret cocok antara aplikasi dan RADIUS

## 🤝 Kontribusi

Kontribusi selalu disambut baik! Ikuti langkah-langkah ini:

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur-keren`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur keren'`)
4. Push ke branch (`git push origin fitur-keren`)
5. Buka Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Dukungan

Jika Anda memiliki pertanyaan atau menghadapi masalah, silakan buka issue baru di repositori GitHub atau hubungi tim dukungan di support@star-access.com.