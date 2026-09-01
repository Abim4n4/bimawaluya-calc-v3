import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Link Budget FTTH Calculator | Teknisi Lapangan',
  description:
    'Kalkulator link budget FTTH untuk teknisi lapangan. Hitung redaman serat, splice, konektor, dan splitter secara cepat dan akurat. Topologi OLT-OTB-ODC-ODP-ONT.',
  keywords: [
    'link budget',
    'FTTH',
    'PON',
    'teknisi lapangan',
    'calculator',
    'OLT',
    'ONT',
    'ODC',
    'ODP',
    'splitter',
  ],
  authors: [{ name: 'Bimawaluya' }],
  openGraph: {
    title: 'Link Budget FTTH Calculator',
    description: 'Alat ukur cepat untuk teknisi jaringan fiber optic',
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
