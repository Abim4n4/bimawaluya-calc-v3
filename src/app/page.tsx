'use client';

import { useState, useEffect } from 'react';
import { TopologySelector } from '@/components/TopologySelector';
import { SegmentInputForm } from '@/components/SegmentInputForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { useCalculation } from '@/hooks/useCalculation';

export default function Home() {
  const {
    topology,
    formData,
    result,
    error,
    loading,
    selectTopology,
    updateSegment,
    updateOLT,
    updateMargin,
    calculate,
    reset,
  } = useCalculation();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">●</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    BimaWaluya Link Budget
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ukur Cepat Total Rasio FTTH
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side: Input */}
            <div className="space-y-6">
              {!topology ? (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <TopologySelector selectedTopology={topology} onSelect={selectTopology} />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {topology === 'topo1'
                          ? '📊 OLT → OTB → ODC → ODP → ONT'
                          : '📊 OLT → OTB → ODP → ONT'}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Masukkan parameter di bawah
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        reset();
                      }}
                      className="text-sm px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded transition-colors"
                    >
                      ↶ Ganti Topologi
                    </button>
                  </div>

                  <SegmentInputForm
                    topology={topology}
                    formData={formData}
                    onOLTChange={updateOLT}
                    onSegmentChange={updateSegment}
                    onMarginChange={updateMargin}
                    onCalculate={calculate}
                    onReset={reset}
                    isLoading={loading}
                  />

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side: Result */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              {result ? (
                <ResultDisplay result={result} input={formData} />
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Hasil akan ditampilkan di sini
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Isi parameter di kiri kemudian tekan "Hitung Link Budget"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            BimaWaluya Link Budget v1.0.0 • Nilai perhitungan bersifat teoritis •
            Verifikasi dengan OPM measurement di lapangan untuk hasil akurat
          </p>
        </footer>
      </div>
    </div>
  );
}
