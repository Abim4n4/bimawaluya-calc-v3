# BimaWaluya Link Budget

**Ukur Cepat Total Rasio FTTH** - Kalkulator link budget untuk teknisi jaringan fiber optik dari OLT hingga ONT.

## 🌟 Features

### Phase 1 (MVP) ✅

**Core Features:**
- ✅ **Topology Selection**: 2 topologi jaringan (OLT→OTB→ODC→ODP→ONT atau OLT→OTB→ODP→ONT)
- ✅ **Dynamic Form**: Form input yang dinamis sesuai topologi
- ✅ **Real-time Calculation**: Perhitungan otomatis saat input berubah
- ✅ **Status Indicator**: Visual status (🟢 PASS / 🟡 WARNING / 🔴 FAIL)
- ✅ **Detailed Breakdown**: Tabel rincian redaman per komponen
- ✅ **Total Rasio Calculation**: Hitung persentase total attenuation terhadap budget
- ✅ **Segment Analysis**: Rekomendasi berdasarkan hasil

**Field Validation:**
- ✅ **Compare vs OPM Measurement**: Bandingkan hasil calculated vs actual OPM reading
- ✅ **Accuracy Assessment**: Hitung accuracy percentage
- ✅ **Field Notes**: Catat kondisi lapangan yang mempengaruhi hasil
- ✅ **Discrepancy Analysis**: Analisis perbedaan dan possible causes
- ✅ **Export Validation Report**: Simpan validation data untuk reference

**User Features:**
- ✅ **Export & Copy**: Copy hasil atau print
- ✅ **Dark Mode**: Mode gelap untuk bekerja di lapangan terik
- ✅ **Mobile Responsive**: Desain mobile-first
- ✅ **Input Validation**: Validasi dengan pesan error jelas

---

## 🔍 **Total Rasio (Total Attenuation Ratio)**

**Total Rasio** = Persentase Total Attenuation terhadap Budget Available

Aplikasi ini hitung:
```
Total Rasio = (Total Attenuation / Budget Available) × 100%

Contoh:
- Budget Available: 33 dB
- Total Attenuation: 28.8 dB
- Total Rasio: 87.3%
- Margin Tersisa: 12.7% (4.2 dB)

Status:
- Total Rasio < 90% → ✅ AMAN (margin >= 3dB)
- Total Rasio 90-95% → ⚠️ HATI-HATI (margin 1-3dB)
- Total Rasio > 95% → ❌ TIDAK AMAN (margin < 1dB)
```

---

## 📊 **Mengapa Field Validation Penting?**

### **Real-world vs Theoretical:**

Hasil calculated PASTI BEDA dengan measurement di lapangan karena:
- Component quality variation
- Installation quality
- Environmental factors (temperature, humidity)
- Fiber bending
- Connector cleanliness
- Tool calibration

**Aplikasi ini punya feature untuk handle perbedaan tsb:**

1. **Calculate** di aplikasi
2. **Measure** dengan OPM di lapangan
3. **Input actual margin** ke aplikasi
4. **Lihat accuracy** & interpretation
5. **Track field conditions** untuk analysis

---

## 📋 Topologi yang Didukung

### Topologi 1: OLT → OTB → ODC → ODP → ONT
4-segment dengan splitter di ODC dan ODP

### Topologi 2: OLT → OTB → ODP → ONT
3-segment dengan splitter di OTB dan ODP

---

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
# http://localhost:3000
```

### Build
```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks

---

## 📦 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── components/
│   ├── TopologySelector.tsx      # Topology UI
│   ├── SegmentInputForm.tsx      # Input form
│   ├── ResultDisplay.tsx         # Results
│   └── FieldValidation.tsx       # Field validation
│
├── hooks/
│   └── useCalculation.ts         # State management
│
└── lib/
    ├── calculator.ts            # Calculation logic
    ├── constants.ts             # Standards & presets
    ├── types.ts                 # TypeScript types
    └── utils.ts                 # Utilities
```

---

## 📊 Standards & Constants

### **Splitter Loss**
| Ratio | Loss (dB) |
|-------|-----------|
| 1:2   | 3.5       |
| 1:4   | 6.0       |
| 1:8   | 9.0       |
| 1:16  | 12.0      |

### **Wavelength Attenuation**
| Wavelength | Attenuation |
|-----------|-------------|
| 1310 nm   | 0.35 dB/km |
| 1490 nm   | 0.25 dB/km |
| 1550 nm   | 0.21 dB/km |

### **Component Losses (Default)**
- Splice: 0.1 dB (fusible)
- Connector: 0.5 dB (SC/APC)

---

## 🎯 Calculation Formula

```
Budget Available (dB) = Tx Power (dBm) - Rx Sensitivity (dBm)

Total Attenuation (dB) = Σ (Fiber + Splice + Connector + Splitter Loss)

Margin Remaining (dB) = Budget Available - Total Attenuation

Total Rasio (%) = (Total Attenuation / Budget Available) × 100

Status:
- PASS: Margin ≥ 3 dB (Total Rasio < 90%)
- WARNING: 1 dB ≤ Margin < 3 dB (90% ≤ Total Rasio < 95%)
- FAIL: Margin < 1 dB (Total Rasio > 95%)
```

---

## 🔍 Field Validation Workflow

### **Step 1: Calculate**
- Input parameter → Get calculated margin + Total Rasio

### **Step 2: Field Measurement**
- Buka OPM
- Ukur Tx power di OLT
- Ukur Rx power di ONT
- Hitung: Actual Margin = Tx - Rx (dalam dB)

### **Step 3: Validate in App**
- Click "Validasi Dengan OPM Measurement"
- Input actual margin dari OPM
- Tambah field notes (opsional)
- Click "Validasi"

### **Step 4: Review Results**
- Lihat comparison: Calculated vs Actual
- Lihat accuracy percentage
- Baca interpretation & recommendations
- Export validation report

---

## ⚠️ Important Notes

- **Nilai default bersifat teoritis** untuk perencanaan standar
- **HARUS validasi dengan OPM measurement** di lapangan
- **Accuracy dapat berubah** berdasarkan kondisi lingkungan
- **Splitter loss bisa bervariasi** antar manufaktur
- **Component aging** mempengaruhi long-term performance

---

## 🌙 Dark Mode

Automatic sesuai system preference atau manual toggle via header button.

---

## 📱 Mobile Optimization

- Mobile-first design (320px+)
- Touch-friendly buttons
- Minimal horizontal scrolling
- Responsive grid layout

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

---

## 📝 Version

**v1.0.0** - MVP Phase 1 with Field Validation

---

## 📄 License

MIT

---

**BimaWaluya Link Budget** - Ukur Cepat Total Rasio FTTH

Alat teknisi lapangan untuk jaringan fiber optik

© 2026 @rhd26 • BimaWaluya Link Budget FTTH

Feedback & Issues: GitHub Issues

