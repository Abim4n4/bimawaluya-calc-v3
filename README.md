# Link Budget FTTH Calculator

**Kalkulator link budget FTTH untuk teknisi lapangan** - Hitungan cepat dan akurat untuk jaringan fiber optik dari OLT hingga ONT.

## 🌟 Features

### Phase 1 (MVP) ✅
- ✅ **Topology Selection**: Pilih antara 2 topologi jaringan (OLT→OTB→ODC→ODP→ONT atau OLT→OTB→ODP→ONT)
- ✅ **Dynamic Form**: Form input yang dinamis sesuai topologi yang dipilih
- ✅ **Real-time Calculation**: Perhitungan otomatis saat input berubah
- ✅ **Status Indicator**: Indikator visual status (🟢 PASS / 🟡 WARNING / 🔴 FAIL)
- ✅ **Detailed Breakdown**: Tabel rincian redaman per komponen dan segment
- ✅ **Segment Analysis**: Rekomendasi berdasarkan hasil perhitungan
- ✅ **Export & Copy**: Copy hasil ke clipboard atau print
- ✅ **Dark Mode**: Mode gelap untuk bekerja di lapangan yang terik
- ✅ **Mobile Responsive**: Desain mobile-first untuk tablet dan smartphone
- ✅ **Input Validation**: Validasi input dengan pesan error yang jelas

### Planned Features
- 📅 **Offline Mode (PWA)**: Kerja tanpa internet, auto-sync saat online
- 📅 **PDF Export**: Export hasil dalam format PDF profesional
- 📅 **GPS Location**: Auto-capture lokasi dengan GPS
- 📅 **Save History**: Simpan 5-10 kalkulasi terakhir
- 📅 **Cloud Sync**: Sinkronisasi ke server untuk supervision

## 📋 Topologi yang Didukung

### Topologi 1: OLT → OTB → ODC → ODP → ONT
```
OLT (Transmitter)
  ↓ [serat + splice + konektor]
OTB (Optical Terminal Box)
  ↓ [serat + splice + konektor]
ODC (Optical Distribution Cabinet) [Splitter: 1:4 atau 1:8]
  ↓ [serat + splice + konektor]
ODP (Optical Distribution Point) [Splitter: 1:8 atau 1:16]
  ↓ [serat + splice + konektor]
ONT (Receiver)
```

### Topologi 2: OLT → OTB → ODP → ONT
```
OLT (Transmitter)
  ↓ [serat + splice + konektor]
OTB [Splitter: 1:8 atau 1:16]
  ↓ [serat + splice + konektor]
ODP (Optical Distribution Point) [Splitter: 1:8 atau 1:16]
  ↓ [serat + splice + konektor]
ONT (Receiver)
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Run production server
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useCallback)
- **Dark Mode**: Built-in with Tailwind

## 📦 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/
│   ├── TopologySelector.tsx     # Topology selection UI
│   ├── SegmentInputForm.tsx     # Input form component
│   └── ResultDisplay.tsx        # Result display component
│
├── hooks/
│   └── useCalculation.ts        # Calculation logic hook
│
└── lib/
    ├── calculator.ts           # Core calculation engine
    ├── constants.ts            # Constants & presets
    ├── types.ts                # TypeScript interfaces
    └── utils.ts                # Utility functions
```

## 📊 Splitter Loss Standards

| Ratio | Loss (dB) |
|-------|-----------|
| 1:2   | 3.5       |
| 1:4   | 6.0       |
| 1:8   | 9.0       |
| 1:16  | 12.0      |

**Note**: Standar di atas dapat diubah manual jika diperlukan.

## 🌊 Wavelength Attenuation

| Wavelength | Attenuation |
|-----------|-------------|
| 1310 nm   | 0.35 dB/km |
| 1490 nm   | 0.25 dB/km |
| 1550 nm   | 0.21 dB/km |

## 🔧 Default Component Losses

- **Splice**: 0.1 dB (dapat diubah)
- **Connector**: 0.5 dB (dapat diubah)

## 📐 Calculation Formula

```
Budget Available = Tx Power (dBm) - Rx Sensitivity (dBm)

Total Attenuation = Σ (
  Fiber Loss (distance × attenuation per wavelength)
  + Splice Loss (count × loss per splice)
  + Connector Loss (count × loss per connector)
  + Splitter Loss (if any)
)

Margin Remaining = Budget Available - Total Attenuation

Status:
- PASS: Margin ≥ 3 dB
- WARNING: 1 dB ≤ Margin < 3 dB
- FAIL: Margin < 1 dB
```

## 🎯 Input Validation Rules

- Tx Power: -20 hingga +10 dBm
- Rx Sensitivity: -40 hingga 0 dBm
- Fiber Length: 0-100 km per segment
- Splice Count: 0-50 per segment
- Connector Count: 0-20 per segment
- Margin Required: 0-10 dB

## 🌙 Dark Mode

Dark mode otomatis mengikuti preferensi sistem. Dapat juga di-toggle manual dengan tombol di header.

## 📱 Mobile Optimization

- Desain mobile-first (viewport 320px+)
- Tombol besar untuk sentuhan
- Minimal scrolling horizontal
- Responsive grid layout

## 🔒 Browser Storage

Saat ini menggunakan state React. Planned untuk menggunakan localStorage di phase berikutnya.

## 📝 Usage Tips

1. **Pilih topologi** yang sesuai dengan jaringan Anda
2. **Gunakan preset** untuk OLT/ONT jika tersedia
3. **Atur wavelength** sesuai segment
4. **Input panjang serat** dengan akurat
5. **Pastikan splice & connector count** sesuai lapangan
6. **Tentukan margin keamanan** (default: 3 dB)
7. **Hitung** dan lihat hasilnya
8. **Copy atau print** untuk dokumentasi

## ⚠️ Important Notes

- **Nilai default bersifat tipikal** untuk perencanaan
- **Verifikasi dengan datasheet** perangkat OLT/ONT yang aktual
- **Validasi dengan OPM measurement** di lapangan
- **Kondisi lapangan** (suhu, kelembaban, umur serat) dapat mempengaruhi hasil
- **Splitter loss** dapat bervariasi tergantung manufaktur

## 🐛 Known Issues

Tidak ada untuk Phase 1 MVP.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 License

MIT

## 👤 Author

**Bimawaluya** - Field Technology Solution

---

**Feedback & Issues**: Silakan report di GitHub Issues

**Version**: 1.0.0 (MVP Phase 1)
