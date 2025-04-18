# Integrasi Payment Gateway - Star Access ISP

Dokumen ini menjelaskan cara mengintegrasikan dan mengelola payment gateway di sistem Star Access ISP Management.

## Gambaran Umum

Sistem Star Access ISP terintegrasi dengan berbagai payment gateway untuk memfasilitasi pembayaran online pelanggan. Saat ini, sistem mendukung:

1. **Nicepay** - Payment gateway yang mendukung pembayaran melalui Virtual Account, Credit Card, dll.
2. **Duitku** - Payment gateway dengan beragam metode pembayaran seperti QRIS, e-wallet, dll.

## Konfigurasi

### Konfigurasi Environment

Tambahkan variabel berikut di file `.env`:

```
# Payment Gateway - Nicepay
NICEPAY_DEV_URL=https://dev.nicepay.co.id/nicepay
NICEPAY_PROD_URL=https://www.nicepay.co.id/nicepay
NICEPAY_MERCHANT_ID=your_merchant_id
NICEPAY_MERCHANT_KEY=your_merchant_key

# Payment Gateway - Duitku
DUITKU_DEV_URL=https://sandbox.duitku.com/webapi
DUITKU_PROD_URL=https://passport.duitku.com/webapi
DUITKU_MERCHANT_CODE=your_merchant_code
DUITKU_API_KEY=your_api_key
```

### Konfigurasi Provider & Metode Pembayaran

Sebelum menggunakan payment gateway, konfigurasi provider dan metode pembayaran di database:

#### Provider Payment Gateway

```sql
INSERT INTO payment_providers 
(code, name, description, is_active, config, endpoints, display_order, logo_url)
VALUES
('nicepay', 'Nicepay', 'Nicepay Payment Gateway', true, 
'{"merchantId": "NICEPAY_MERCHANT", "merchantKey": "your_merchant_key"}',
'{"createVA": "/api/v1.0/payments/create-va", "createCC": "/api/v1.0/payments/create-credit-card"}',
1, 'https://example.com/nicepay-logo.png');

INSERT INTO payment_providers 
(code, name, description, is_active, config, endpoints, display_order, logo_url)
VALUES
('duitku', 'Duitku', 'Duitku Payment Gateway', true, 
'{"merchantCode": "D0001", "apiKey": "your_api_key"}',
'{"inquiry": "/api/merchant/v2/inquiry", "transactionStatus": "/api/merchant/transactionStatus"}',
2, 'https://example.com/duitku-logo.png');
```

#### Metode Pembayaran

```sql
-- Untuk Nicepay
INSERT INTO payment_methods
(provider_id, code, name, description, is_active, fee_flat, fee_percent, fee_charged_to, display_order, icon_url)
VALUES
('provider_uuid', 'va_bca', 'Virtual Account BCA', 'Pembayaran melalui Virtual Account BCA', 
true, 4000, 0, 'customer', 1, 'https://example.com/bca-logo.png');

INSERT INTO payment_methods
(provider_id, code, name, description, is_active, fee_flat, fee_percent, fee_charged_to, display_order, icon_url)
VALUES
('provider_uuid', 'credit_card', 'Kartu Kredit', 'Pembayaran dengan Kartu Kredit', 
true, 0, 2.5, 'customer', 2, 'https://example.com/cc-logo.png');

-- Untuk Duitku
INSERT INTO payment_methods
(provider_id, code, name, description, is_active, fee_flat, fee_percent, fee_charged_to, display_order, icon_url)
VALUES
('provider_uuid_2', 'VC', 'QRIS', 'Pembayaran dengan QRIS', 
true, 0, 0.7, 'merchant', 1, 'https://example.com/qris-logo.png');
```

## Menggunakan Payment Gateway

### 1. Tampilkan Metode Pembayaran

Frontend harus memanggil endpoint API untuk mendapatkan provider dan metode pembayaran yang tersedia:

```
GET /api/payment-gateway/providers
GET /api/payment-gateway/providers/:code/methods
```

### 2. Membuat Transaksi Pembayaran

Setelah pelanggan memilih metode pembayaran, buat transaksi:

```
POST /api/payment-gateway/transactions
```

Request:
```json
{
  "invoiceId": "123e4567-e89b-12d3-a456-426614174000",
  "providerCode": "nicepay",
  "methodCode": "va_bca",
  "metadata": {
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com"
  }
}
```

Response:
```json
{
  "transactionId": "789e0123-45c6-d78e-9012-345678901234",
  "referenceNumber": "STAR-1A2B3C4D",
  "amount": 300000,
  "fee": 4000,
  "totalAmount": 304000,
  "status": "pending",
  "expiryDate": "2025-04-20T15:30:00.000Z",
  "paymentDetails": {
    "vaNumber": "12345678901234",
    "bankCode": "BCA",
    "bankName": "Bank Central Asia"
  },
  "redirectUrl": null
}
```

### 3. Menangani Callback

Payment gateway akan mengirimkan callback ketika status pembayaran berubah. Endpoint callback:

```
POST /api/payment-gateway/callback/:provider
```

### 4. Redirect Setelah Pembayaran

Untuk metode pembayaran seperti Credit Card yang memerlukan redirect ke halaman pembayaran, gunakan endpoint:

```
GET /api/payment-gateway/return/:provider
```

Endpoint ini akan mengarahkan pengguna kembali ke halaman frontend berdasarkan konfigurasi `FRONTEND_URL`.

### 5. Memeriksa Status Pembayaran

Untuk memeriksa status transaksi:

```
GET /api/payment-gateway/check-status/:referenceNumber
```

### 6. Membatalkan Transaksi

Untuk membatalkan transaksi pembayaran yang belum selesai:

```
POST /api/payment-gateway/cancel/:referenceNumber
```

## Alur Pembayaran

1. **Virtual Account**:
   - Sistem membuat transaksi VA di payment gateway
   - Pelanggan mendapatkan nomor VA dan petunjuk pembayaran
   - Pelanggan melakukan transfer ke nomor VA
   - Gateway mengirimkan callback setelah pembayaran diterima
   - Sistem memproses pembayaran dan memperbarui status faktur

2. **Credit Card**:
   - Sistem membuat transaksi CC di payment gateway
   - Pelanggan diarahkan ke halaman pembayaran gateway
   - Pelanggan memasukkan detail kartu kredit
   - Setelah proses pembayaran, pengguna diarahkan kembali ke sistem
   - Gateway mengirimkan callback
   - Sistem memproses pembayaran dan memperbarui status faktur

3. **QRIS**:
   - Sistem membuat transaksi QRIS di payment gateway
   - Pelanggan mendapatkan kode QR untuk dipindai
   - Pelanggan memindai QR dengan aplikasi e-wallet
   - Gateway mengirimkan callback setelah pembayaran
   - Sistem memproses pembayaran dan memperbarui status faktur

## Troubleshooting

### Callback Tidak Diterima

1. Pastikan URL callback dapat diakses dari internet
2. Periksa firewall dan pengaturan keamanan server
3. Periksa log server untuk kesalahan selama pemrosesan callback
4. Hubungi provider jika diperlukan untuk memeriksa status callback

### Status Pembayaran Tidak Diperbarui

1. Gunakan endpoint check-status untuk memeriksa status terbaru dari payment gateway
2. Periksa apakah callback diterima dan diproses dengan benar
3. Verifikasi konfigurasi signature untuk keamanan callback

### Validasi Signature

Callback dari payment gateway perlu divalidasi untuk memastikan autentisitas:

- **Nicepay**: Signature dihasilkan dengan SHA-256 dari merchantId + timestamp + amount + merchantKey
- **Duitku**: Signature dihasilkan dengan MD5 dari merchantCode + amount + merchantOrderId + apiKey

## Mendaftarkan Provider Baru

Untuk menambahkan provider payment gateway baru:

1. Buat service provider baru di `src/modules/payment-gateway/providers/`
2. Daftarkan service di `payment-gateway.module.ts`
3. Tambahkan logika pemrosesan di `payment-gateway.service.ts`
4. Tambahkan konfigurasi di database dan file `.env`

## Keamanan

- Semua kunci API dan kode merchant harus disimpan sebagai variabel lingkungan
- Validasi signature untuk semua callback
- Gunakan HTTPS untuk semua komunikasi dengan payment gateway
- Lakukan pencatatan (logging) untuk semua transaksi dan callback