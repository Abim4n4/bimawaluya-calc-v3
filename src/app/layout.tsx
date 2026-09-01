import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BimaWaluya Link Budget | Ukur Cepat Total Rasio FTTH',
  description:
    'BimaWaluya Link Budget - Alat ukur cepat total rasio untuk teknisi jaringan fiber optik FTTH. Hitung link budget, attenuation, splitter loss, dan margin dengan akurat. OLT-OTB-ODC-ODP-ONT.',
  keywords: [
    'link budget',
    'total rasio',
    'FTTH',
    'PON',
    'teknisi jaringan',
    'fiber optic',
    'calculator',
    'OLT',
    'ONT',
    'ODC',
    'ODP',
    'BimaWaluya',
    'attenuation',
    'splitter',
  ],
  authors: [{ name: 'BimaWaluya' }],
  openGraph: {
    title: 'BimaWaluya Link Budget',
    description: 'Ukur Cepat Total Rasio untuk jaringan fiber FTTH',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
