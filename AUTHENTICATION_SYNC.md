# Authentication & Database Sync

## Masalah yang Dipecahkan

Ketika data user diubah langsung di database, sesi tetap menampilkan data lama karena:
1. JWT token hanya menyimpan data saat login
2. Client tidak sync dengan database
3. Tidak ada mekanisme refresh otomatis

## Solusi yang Diimplementasikan

### 1. **Database Verification di /api/auth/verify**
- Setiap request verifikasi mengecek database terbaru
- Return data fresh dari database, bukan dari token
- Auto-logout jika user dihapus dari database

### 2. **Smart SessionProvider dengan Optimasi**
- **Cached Authentication**: Gunakan localStorage data jika tersedia
- **Event-driven Refresh**: Hanya check server saat:
  - User kembali ke tab (setelah 1+ menit away)
  - Manual refresh dipanggil
  - Tab storage change detected
- **Smart Timestamp Tracking**: Avoid unnecessary server calls
- **Cross-tab Sync**: Logout otomatis di semua tab

### 3. **Role Change Detection**
- Auto-redirect jika user kehilangan akses admin
- Notifikasi visual untuk perubahan data
- Prevent access dengan middleware + client-side check

### 4. **Manual Refresh Function**
```javascript
const { refreshUser } = useSession()
await refreshUser() // Force refresh data dari database
```

## Cara Kerja (Optimized)

1. **Login**: Token disimpan di localStorage + cookie
2. **Initial Load**: Gunakan cached data dari localStorage
3. **Middleware**: Check token untuk akses server-side 
4. **Smart Refresh**: Server check hanya saat:
   - Tab focus setelah 1+ menit away
   - Manual refresh
   - Cross-tab logout detected
5. **Change Detection**: Redirect/notify jika ada perubahan

## Testing

1. Login sebagai admin
2. Ubah role di database dari admin ke user
3. Tunggu maksimal 5 menit atau refresh manual
4. User akan auto-redirect dari admin dashboard

## Optimasi Performa

### ❌ Sebelum (Masalah):
- Request GET `/api/auth/verify` setiap 5 menit
- Continuous server calls bahkan saat tab inactive
- Memberatkan server dan frontend

### ✅ Sesudah (Solusi):
- **Cached First**: Gunakan localStorage untuk fast load
- **Event-driven**: Hanya fetch saat user interact
- **Smart Timing**: Check server setelah 1+ menit away
- **Cross-tab Sync**: Efficient multi-tab handling

## Benefits

- ✅ Real-time sync dengan database
- ✅ Auto-logout jika user dihapus
- ✅ Auto-redirect jika role berubah  
- ✅ Visual notification untuk perubahan
- ✅ Manual refresh capability
- ✅ Proper security dengan double-check
- ✅ **Minimal server load** - No unnecessary requests
- ✅ **Fast initial load** - Cached authentication
- ✅ **Cross-tab sync** - Multi-window support