# HospitalHelp - Sistem Helpdesk Rumah Sakit

Sistem helpdesk komprehensif untuk manajemen tiket rumah sakit dengan Progressive Web App (PWA) yang dapat diinstal di perangkat mobile seperti aplikasi native Android/iOS.

## 🚀 Fitur Utama

- **Manajemen Tiket Cerdas**: Perutean tiket otomatis, penugasan prioritas, dan eskalasi real-time
- **Akses Berbasis Peran**: Izin aman untuk administrator, teknisi, dan pengguna
- **Analitik Real-Time**: Dasbor komprehensif dengan metrik dan pelaporan
- **Lampiran File**: Upload file aman untuk dokumen medis
- **Pelacakan Kemajuan**: Pembaruan status dan jejak audit lengkap
- **Responsif Mobile**: Desain yang bekerja optimal di semua perangkat
- **Progressive Web App**: Dapat diinstal seperti aplikasi native

## 📱 Progressive Web App (PWA)

Aplikasi ini telah dikonfigurasi sebagai PWA yang dapat diinstal di perangkat mobile dan desktop.

### Cara Instal di Android:

1. Buka aplikasi di browser Chrome/Samsung Internet
2. Ketuk ikon "Instal Aplikasi" atau "Add to Home Screen"
3. Ikuti petunjuk untuk menyelesaikan instalasi

### Cara Instal di iOS:

1. Buka aplikasi di browser Safari
2. Ketuk ikon share (bagikan)
3. Pilih "Add to Home Screen"
4. Ketuk "Add" untuk menyelesaikan instalasi

### Cara Instal di Desktop:

1. Buka aplikasi di browser Chrome/Edge
2. Klik ikon instal di address bar atau menu
3. Ikuti petunjuk untuk menyelesaikan instalasi

## 🛠️ Teknologi

- **Backend**: Laravel 11 dengan PHP
- **Frontend**: React 18 dengan TypeScript
- **Styling**: Tailwind CSS dengan shadcn/ui
- **State Management**: Inertia.js untuk SPA
- **Database**: MySQL
- **Authentication**: Laravel Fortify
- **PWA Features**:
    - Service Worker untuk caching offline
    - Web App Manifest untuk instalasi
    - Push notifications (opsional)
    - Background sync

## 📦 Instalasi & Setup

1. **Clone repository**:

    ```bash
    git clone <repository-url>
    cd hospitalhelp
    ```

2. **Install dependencies**:

    ```bash
    composer install
    npm install
    ```

3. **Setup environment**:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Setup database**:

    ```bash
    php artisan migrate --seed
    ```

5. **Build assets**:

    ```bash
    npm run build
    ```

6. **Start development server**:
    ```bash
    php artisan serve
    ```

## 🔧 PWA Configuration

### File Konfigurasi PWA:

- `public/site.webmanifest` - Web App Manifest
- `public/sw.js` - Service Worker
- `public/offline.html` - Halaman offline
- `public/browserconfig.xml` - Konfigurasi Windows tiles

### Hook dan Komponen PWA:

- `resources/js/hooks/use-pwa-install.ts` - Hook untuk mendeteksi instalasi PWA
- `resources/js/hooks/use-push-subscription.ts` - Hook untuk subscribe/unsubscribe push
- `resources/js/components/pwa-install-button.tsx` - Komponen tombol instal PWA
- `resources/js/components/PushSubscribeButton.tsx` - Tombol subscribe notifikasi (web-push)

### Push notifications (web-push) — setup cepat

1. Install package web-push (server-side):

```bash
composer require laravel-notification-channels/webpush
```

2. Publish config (opsional) dan generate VAPID keys:

```bash
php artisan vendor:publish --provider="NotificationChannels\WebPush\WebPushServiceProvider" --tag="config"
php artisan webpush:vapid --show
```

3. Tambahkan ke `.env` (gunakan nilai dari perintah di atas):

```
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VITE_VAPID_PUBLIC_KEY=your_public_key_here
```

4. Migrasi tabel (membuat `push_subscriptions`):

```bash
php artisan migrate
```

5. Jalankan queue worker (direkomendasikan untuk pengiriman queued notifications):

```bash
php artisan queue:work --tries=3
```

6. Cara uji cepat:

- Login sebagai teknisi → tekan `Aktifkan Notifikasi`
- Buat tiket dan assign ke teknisi tersebut → teknisi akan menerima push
- Tambah komentar / ubah status → pembuat tiket yang subscribe akan menerima push

Mobile push (Android / iOS) — cepat

- Backend: tambahkan `FCM_SERVER_KEY` ke `.env` (lihat README bagian "Mobile push (FCM)" di bawah untuk detail).
- Mobile app: kirim device token ke endpoint `POST /mobile/devices` (authed) — server akan mengirim notifikasi via FCM ketika ada event.

Catatan: push hanya bekerja pada HTTPS (atau localhost). Jika Anda menggunakan staging/production, pastikan domain memiliki sertifikat SSL.

## 🌐 Browser Support

### Reports — Performance (PDF)

Admin/technician can download a performance report (response time created→resolved).

- Endpoint (admin): `GET /admin/reports/performance?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD&format=pdf`
- HTML preview: `format=html` (useful for debugging / CI tests)
- To enable PDF export install:

    composer require barryvdh/laravel-dompdf

- Configure FQDN + queue worker for large reports.

PWA didukung oleh browser modern berikut:

- Chrome 70+
- Firefox 68+
- Safari 12.1+ (iOS 12.2+)
- Edge 79+
- Samsung Internet 9.0+

## 📋 Fitur Offline

Ketika offline, aplikasi akan:

- Menampilkan halaman offline yang informatif
- Meng-cache halaman dan assets penting
- Menyimpan data form untuk sinkronisasi nanti
- Memberikan pengalaman yang konsisten

## 🔒 Keamanan

- HTTPS diperlukan untuk PWA
- Service Worker hanya dapat mengakses domain yang sama
- Cache storage terpisah per origin
- Push notifications memerlukan izin pengguna

## 📊 Performa

- Lazy loading untuk komponen
- Code splitting otomatis
- Asset optimization
- Service Worker caching untuk performa yang lebih baik

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

## 📞 Dukungan

Untuk dukungan teknis atau pertanyaan:

- Buat issue di GitHub
- Hubungi tim development
- Dokumentasi lengkap tersedia di `/docs`

---

**HospitalHelp** - Mempermudah operasi rumah sakit dengan manajemen helpdesk cerdas. Dibuat untuk tenaga kesehatan, dirancang untuk efisiensi.
