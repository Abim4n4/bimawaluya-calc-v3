import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BimaWaluya LinkBug | Linkbudget Ukur Cepat FTTH',
  description:
    'BimaWaluya LinkBug - Kalkulator link budget FTTH untuk teknisi lapangan. Hitung redaman serat, splice, konektor, dan splitter secara cepat. Topologi OLT-OTB-ODC-ODP-ONT.',
  keywords: [
    'linkbug',
    'link budget',
    'FTTH',
    'PON',
    'teknisi lapangan',
    'calculator',
    'OLT',
    'ONT',
    'ODC',
    'ODP',
    'BimaWaluya',
  ],
  authors: [{ name: 'BimaWaluya' }],
  openGraph: {
    title: 'BimaWaluya LinkBug',
    description: 'Alat ukur cepat link budget untuk jaringan fiber optic FTTH',
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
