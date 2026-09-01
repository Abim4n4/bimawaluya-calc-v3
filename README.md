# BimaWaluya LinkBug

**Linkbudget ukur cepat Jaringan FTTH** - Kalkulator link budget untuk teknisi jaringan fiber optik dari OLT hingga ONT.

## 🌟 Features

### Phase 1 (MVP) ✅

**Core Features:**
- ✅ **Topology Selection**: 2 topologi jaringan (OLT→OTB→ODC→ODP→ONT atau OLT→OTB→ODP→ONT)
- ✅ **Dynamic Form**: Form input yang dinamis sesuai topologi
- ✅ **Real-time Calculation**: Perhitungan otomatis saat input berubah
- ✅ **Status Indicator**: Visual status (🟢 PASS / 🟡 WARNING / 🔴 FAIL)
- ✅ **Detailed Breakdown**: Tabel rincian redaman per komponen
- ✅ **Segment Analysis**: Rekomendasi berdasarkan hasil

**Field Validation (NEW):**
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

## 🔍 **Yang BEDA dari Kalkulator Biasa:**

### **Feature #1: Field Validation**

Aplikasi ini tahu bahwa **hasil di lapangan PASTI BEDA** dengan calculation. Oleh karena itu, ada feature untuk:

1. **Input actual margin dari OPM measurement**
   - Buka OPM → ukur Tx di OLT → ukur Rx di ONT → hitung margin
   - Input di aplikasi → automatic comparison

2. **Lihat accuracy vs calculated**
   ```
   Calculated: 4.2 dB
   Actual (OPM): 4.5 dB
   Difference: +0.3 dB (7% accuracy)
   Status: ✅ Akurasi Tinggi
   ```

3. **Understand perbedaan**
   - Kalau actual lebih baik → excellent!
   - Kalau actual lebih buruk → ada faktor lapangan:
     * Connector/splice berkualitas rendah
     * Serat banyak ditekuk (bending loss)
     * Kelembaban tinggi
     * Pengukuran tidak akurat

4. **Track field notes**
   - Catat "kabel rusak di tiang 5" atau "splitter basah"
   - Link notes dengan measurement result

---

## 📊 **Mengapa Hasil Di Lapangan Beda?**

### **Theoretical vs Real-World Factors:**

| Factor | Impact | Mitigasi |
|--------|--------|----------|
| **Component Quality** | Loss bisa lebih tinggi | Gunakan component standard |
| **Installation Quality** | Splice/connector bisa jelek | Training untuk teknisi |
| **Environmental** | Suhu, humidity mempengaruhi | Measure di waktu konsisten |
| **Fiber Bending** | Bending radius terlalu ketat | Check fiber routing |
| **Component Aging** | Serat/connector degradasi | Replace old components |
| **Measurement Tool** | OPM accuracy ±0.3dB | Calibrate OPM regularly |
| **Connector Contamination** | Debu/moisture di connector | Clean before measure |

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
│   └── FieldValidation.tsx       # NEW: Validation vs OPM
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
Budget Available = Tx Power - Rx Sensitivity

Total Attenuation = Σ (Fiber + Splice + Connector + Splitter Loss)

Margin Remaining = Budget Available - Total Attenuation

Status:
- PASS: Margin ≥ 3 dB
- WARNING: 1 dB ≤ Margin < 3 dB
- FAIL: Margin < 1 dB
```

---

## 🔍 Field Validation Workflow

### **Step 1: Calculate**
- Masukkan parameter → Get calculated margin

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

### **Step 5: Action**
- Kalau accuracy bagus (±10%) → proceed
- Kalau accuracy jelek (>20% diff) → troubleshoot:
  * Check connector cleanliness
  * Check fiber bending
  * Check splice quality
  * Repeat measurement

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

**BimaWaluya LinkBug** - Alat Teknisi Lapangan untuk FTTH

Feedback & Issues: GitHub Issues

