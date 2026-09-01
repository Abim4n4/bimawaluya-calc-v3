import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BimaWaluya Link Budget FTTH | ukur cepat TTL Rasio jaringan fiber',
  description:
    'BimaWaluya Link Budget FTTH - Alat ukur cepat TTL Rasio jaringan fiber optik untuk teknisi lapangan. Hitung redaman serat, splice, konektor, dan splitter secara akurat. Topologi OLT-OTB-ODC-ODP-ONT.',
  keywords: [
    'link budget',
    'TTL rasio',
    'FTTH',
    'PON',
    'teknisi lapangan',
    'calculator',
    'OLT',
    'ONT',
    'ODC',
    'ODP',
    'BimaWaluya',
    'attenuation',
    'fiber optic',
  ],
  authors: [{ name: 'BimaWaluya' }],
  openGraph: {
    title: 'BimaWaluya Link Budget FTTH',
    description: 'Alat ukur cepat TTL Rasio untuk jaringan fiber optic FTTH',
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
