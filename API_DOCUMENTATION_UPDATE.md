# Dokumentasi API Payment Gateway

Berikut ini adalah dokumentasi untuk API Payment Gateway yang baru ditambahkan ke sistem Star Access ISP Management. Tambahkan dokumentasi ini ke bagian yang sesuai dalam dokumentasi API utama.

## Payment Gateway

### Mendapatkan Semua Provider Pembayaran

```
GET /payment-gateway/providers
```

Response:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "code": "nicepay",
    "name": "Nicepay",
    "description": "Nicepay Payment Gateway",
    "isActive": true,
    "logoUrl": "https://example.com/nicepay-logo.png",
    "paymentMethods": [
      {
        "id": "234f5678-f90a-34e4-b567-537725285111",
        "code": "va_bca",
        "name": "Virtual Account BCA",
        "description": "Pembayaran melalui Virtual Account BCA",
        "isActive": true,
        "feeFlat": 4000,
        "feePercent": 0,
        "feeChargedTo": "customer",
        "iconUrl": "https://example.com/bca-logo.png"
      },
      {
        "id": "345g6789-g01b-45f5-c678-648836396222",
        "code": "credit_card",
        "name": "Kartu Kredit",
        "description": "Pembayaran dengan Kartu Kredit",
        "isActive": true,
        "feeFlat": 0,
        "feePercent": 2.5,
        "feeChargedTo": "customer",
        "iconUrl": "https://example.com/cc-logo.png"
      }
    ]
  },
  {
    "id": "456h7890-h12c-56g6-d789-759947407333",
    "code": "duitku",
    "name": "Duitku",
    "description": "Duitku Payment Gateway",
    "isActive": true,
    "logoUrl": "https://example.com/duitku-logo.png",
    "paymentMethods": [
      {
        "id": "567i8901-i23d-67h7-e890-860058518444",
        "code": "VC",
        "name": "QRIS",
        "description": "Pembayaran dengan QRIS",
        "isActive": true,
        "feeFlat": 0,
        "feePercent": 0.7,
        "feeChargedTo": "merchant",
        "iconUrl": "https://example.com/qris-logo.png"
      }
    ]
  }
]
```

### Mendapatkan Metode Pembayaran Berdasarkan Provider

```
GET /payment-gateway/providers/:code/methods
```

Response:
```json
[
  {
    "id": "234f5678-f90a-34e4-b567-537725285111",
    "code": "va_bca",
    "name": "Virtual Account BCA",
    "description": "Pembayaran melalui Virtual Account BCA",
    "isActive": true,
    "feeFlat": 4000,
    "feePercent": 0,
    "feeChargedTo": "customer",
    "iconUrl": "https://example.com/bca-logo.png"
  },
  {
    "id": "345g6789-g01b-45f5-c678-648836396222",
    "code": "credit_card",
    "name": "Kartu Kredit",
    "description": "Pembayaran dengan Kartu Kredit",
    "isActive": true,
    "feeFlat": 0,
    "feePercent": 2.5,
    "feeChargedTo": "customer",
    "iconUrl": "https://example.com/cc-logo.png"
  }
]
```

### Membuat Transaksi Pembayaran

```
POST /payment-gateway/transactions
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

### Mendapatkan Transaksi Berdasarkan ID

```
GET /payment-gateway/transactions/:id
```

Response:
```json
{
  "id": "789e0123-45c6-d78e-9012-345678901234",
  "referenceNumber": "STAR-1A2B3C4D",
  "invoiceId": "123e4567-e89b-12d3-a456-426614174000",
  "customerId": "987z6543-21y0-98x7-w654-321012345678",
  "providerCode": "nicepay",
  "methodCode": "va_bca",
  "externalId": "NICEPAY-TX-123456789",
  "amount": 300000,
  "fee": 4000,
  "totalAmount": 304000,
  "status": "pending",
  "expiryDate": "2025-04-20T15:30:00.000Z",
  "paidAt": null,
  "canceledAt": null,
  "paymentDetails": {
    "vaNumber": "12345678901234",
    "bankCode": "BCA",
    "bankName": "Bank Central Asia"
  },
  "callbackData": null,
  "metadata": {
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com"
  },
  "notes": null,
  "createdAt": "2025-04-19T15:30:00.000Z",
  "updatedAt": "2025-04-19T15:30:00.000Z"
}
```

### Mendapatkan Transaksi Berdasarkan Nomor Referensi

```
GET /payment-gateway/transactions/reference/:referenceNumber
```

Response: (seperti respon GET by ID)

### Mendapatkan Daftar Transaksi

```
GET /payment-gateway/transactions?page=1&limit=10&status=pending&customerId=987z6543-21y0-98x7-w654-321012345678
```

Parameters:
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)
- `invoiceId`: Filter berdasarkan ID faktur
- `customerId`: Filter berdasarkan ID pelanggan
- `providerCode`: Filter berdasarkan kode provider
- `methodCode`: Filter berdasarkan kode metode pembayaran
- `status`: Filter berdasarkan status (pending, success, failed, expired, canceled)
- `startDate`: Filter berdasarkan tanggal mulai
- `endDate`: Filter berdasarkan tanggal akhir
- `search`: Pencarian berdasarkan nomor referensi atau ID transaksi eksternal

Response:
```json
{
  "data": [
    {
      "id": "789e0123-45c6-d78e-9012-345678901234",
      "referenceNumber": "STAR-1A2B3C4D",
      "invoiceId": "123e4567-e89b-12d3-a456-426614174000",
      "customerId": "987z6543-21y0-98x7-w654-321012345678",
      "providerCode": "nicepay",
      "methodCode": "va_bca",
      "externalId": "NICEPAY-TX-123456789",
      "amount": 300000,
      "fee": 4000,
      "totalAmount": 304000,
      "status": "pending",
      "expiryDate": "2025-04-20T15:30:00.000Z",
      "createdAt": "2025-04-19T15:30:00.000Z",
      "updatedAt": "2025-04-19T15:30:00.000Z"
    }
    // ... more transactions
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### Memeriksa Status Pembayaran

```
GET /payment-gateway/check-status/:referenceNumber
```

Response:
```json
{
  "transactionId": "789e0123-45c6-d78e-9012-345678901234",
  "referenceNumber": "STAR-1A2B3C4D",
  "status": "success",
  "providerStatus": {
    "status": "00",
    "message": "Success",
    "amount": 304000,
    "transactionDate": "2025-04-19T16:30:00.000Z"
  }
}
```

### Membatalkan Transaksi Pembayaran

```
POST /payment-gateway/cancel/:referenceNumber
```

Response:
```json
{
  "success": true,
  "referenceNumber": "STAR-1A2B3C4D",
  "status": "canceled",
  "providerResponse": {
    "status": "00",
    "message": "Transaction canceled successfully"
  }
}
```

### Endpoint Callback (Khusus Payment Gateway)

```
POST /payment-gateway/callback/:provider
```

Request: (bervariasi tergantung provider)

Response:
```json
{
  "success": true,
  "referenceNumber": "STAR-1A2B3C4D",
  "status": "success"
}
```

### Mendapatkan Statistik Payment Gateway

```
GET /payment-gateway/stats?startDate=2025-04-01&endDate=2025-04-19
```

Response:
```json
{
  "totalTransactions": 250,
  "successTransactions": 200,
  "pendingTransactions": 30,
  "failedTransactions": 5,
  "expiredTransactions": 10,
  "canceledTransactions": 5,
  "successRate": 80,
  "totalAmount": 60000000,
  "transactionsByProvider": [
    {
      "provider": "nicepay",
      "count": "150",
      "amount": "45000000"
    },
    {
      "provider": "duitku",
      "count": "100",
      "amount": "15000000"
    }
  ],
  "transactionsByMethod": [
    {
      "method": "va_bca",
      "count": "100",
      "amount": "30000000"
    },
    {
      "method": "credit_card",
      "count": "50",
      "amount": "15000000"
    },
    {
      "method": "VC",
      "count": "100",
      "amount": "15000000"
    }
  ]
}
```

## Implementasi di Frontend dan Mobile

### Frontend Web

```javascript
// Contoh penggunaan untuk pembuatan pembayaran
import api from '../services/api';

async function createPayment(invoiceId) {
  try {
    // 1. Dapatkan provider pembayaran
    const { data: providers } = await api.get('/payment-gateway/providers');
    
    // 2. Dapatkan metode pembayaran dari provider pertama
    const { data: methods } = await api.get(`/payment-gateway/providers/${providers[0].code}/methods`);
    
    // 3. Buat transaksi pembayaran
    const paymentData = {
      invoiceId: invoiceId,
      providerCode: providers[0].code,
      methodCode: methods[0].code,
      metadata: {
        customerName: 'Nama Pelanggan',
        customerEmail: 'email@customer.com'
      }
    };
    
    const { data: transaction } = await api.post('/payment-gateway/transactions', paymentData);
    
    // 4. Tampilkan informasi pembayaran
    if (transaction.redirectUrl) {
      // Jika perlu redirect (seperti pembayaran kartu kredit)
      window.location.href = transaction.redirectUrl;
    } else {
      // Tampilkan instruksi pembayaran (seperti Virtual Account)
      showPaymentInstructions(transaction);
    }
    
    return transaction;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

function showPaymentInstructions(transaction) {
  // Implementasi UI untuk menampilkan instruksi pembayaran
  if (transaction.paymentDetails.vaNumber) {
    // Tampilkan informasi Virtual Account
    return (
      `<div class="payment-instructions">
        <h3>Instruksi Pembayaran</h3>
        <p>Silakan transfer ke rekening Virtual Account berikut:</p>
        <div class="va-details">
          <strong>Bank:</strong> ${transaction.paymentDetails.bankName}<br>
          <strong>Nomor VA:</strong> ${transaction.paymentDetails.vaNumber}<br>
          <strong>Jumlah:</strong> Rp ${transaction.totalAmount.toLocaleString()}<br>
          <strong>Batas Waktu:</strong> ${new Date(transaction.expiryDate).toLocaleString()}
        </div>
      </div>`
    );
  } else if (transaction.paymentDetails.qrCode) {
    // Tampilkan QR Code
    return (
      `<div class="payment-instructions">
        <h3>Instruksi Pembayaran</h3>
        <p>Silakan scan QR Code berikut dengan aplikasi e-wallet Anda:</p>
        <div class="qr-code">
          <img src="data:image/png;base64,${transaction.paymentDetails.qrCode}" alt="QR Code" />
        </div>
        <strong>Jumlah:</strong> Rp ${transaction.totalAmount.toLocaleString()}<br>
        <strong>Batas Waktu:</strong> ${new Date(transaction.expiryDate).toLocaleString()}
      </div>`
    );
  }
}
```

### Mobile (React Native)

```javascript
// Contoh penggunaan untuk pembuatan pembayaran
import api from '../services/api';
import { Linking } from 'react-native';

async function createPayment(invoiceId) {
  try {
    // 1. Dapatkan provider pembayaran
    const { data: providers } = await api.get('/payment-gateway/providers');
    
    // 2. Dapatkan metode pembayaran dari provider pertama
    const { data: methods } = await api.get(`/payment-gateway/providers/${providers[0].code}/methods`);
    
    // 3. Buat transaksi pembayaran
    const paymentData = {
      invoiceId: invoiceId,
      providerCode: providers[0].code,
      methodCode: methods[0].code,
      metadata: {
        customerName: 'Nama Pelanggan',
        customerEmail: 'email@customer.com'
      }
    };
    
    const { data: transaction } = await api.post('/payment-gateway/transactions', paymentData);
    
    // 4. Tampilkan informasi pembayaran
    if (transaction.redirectUrl) {
      // Jika perlu redirect (seperti pembayaran kartu kredit)
      await Linking.openURL(transaction.redirectUrl);
    } else {
      // Navigasi ke halaman instruksi pembayaran
      navigation.navigate('PaymentInstructions', { transaction });
    }
    
    return transaction;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

// Kemudian di halaman PaymentInstructions
function PaymentInstructionsScreen({ route }) {
  const { transaction } = route.params;
  
  useEffect(() => {
    // Setup polling untuk memeriksa status pembayaran
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/payment-gateway/check-status/${transaction.referenceNumber}`);
        if (data.status === 'success') {
          clearInterval(interval);
          navigation.navigate('PaymentSuccess');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 10000); // Check setiap 10 detik
    
    return () => clearInterval(interval);
  }, []);
  
  // Render UI berdasarkan jenis pembayaran
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instruksi Pembayaran</Text>
      
      {transaction.paymentDetails.vaNumber ? (
        <View style={styles.vaDetails}>
          <Text style={styles.label}>Bank:</Text>
          <Text style={styles.value}>{transaction.paymentDetails.bankName}</Text>
          
          <Text style={styles.label}>Nomor VA:</Text>
          <Text style={styles.valueHighlight}>{transaction.paymentDetails.vaNumber}</Text>
          
          <Text style={styles.label}>Jumlah:</Text>
          <Text style={styles.value}>Rp {transaction.totalAmount.toLocaleString()}</Text>
          
          <Text style={styles.label}>Batas Waktu:</Text>
          <Text style={styles.value}>{new Date(transaction.expiryDate).toLocaleString()}</Text>
        </View>
      ) : transaction.paymentDetails.qrCode ? (
        <View style={styles.qrContainer}>
          <Image
            style={styles.qrCode}
            source={{ uri: `data:image/png;base64,${transaction.paymentDetails.qrCode}` }}
          />
          <Text style={styles.label}>Scan QR Code di atas dengan aplikasi e-wallet Anda</Text>
          
          <Text style={styles.label}>Jumlah:</Text>
          <Text style={styles.value}>Rp {transaction.totalAmount.toLocaleString()}</Text>
          
          <Text style={styles.label}>Batas Waktu:</Text>
          <Text style={styles.value}>{new Date(transaction.expiryDate).toLocaleString()}</Text>
        </View>
      ) : null}
    </View>
  );
}
```

Dengan panduan implementasi di atas, Frontend Web dan Mobile dapat mengintegrasikan pembayaran melalui payment gateway dengan mudah dan konsisten.