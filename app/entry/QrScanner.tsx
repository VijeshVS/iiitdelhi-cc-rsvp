'use client';

import { useEffect, useRef, useState } from 'react';

interface QrScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScan, onClose }: QrScannerProps) {
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerId = useRef<string>('qr-reader-' + Math.random().toString(36).substring(7));
  const [ready, setReady] = useState(false);
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  });
  const scannedRef = useRef(false);

  // Wait for DOM element to be rendered before starting scanner
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    let mounted = true;

    const startScanner = async () => {
      try {
        // Dynamic import at runtime only
        const { Html5Qrcode } = await import('html5-qrcode');
        
        if (!mounted) return;

        const el = document.getElementById(containerId.current);
        if (!el) return;

        const scanner = new Html5Qrcode(containerId.current);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Prevent multiple scans
            if (scannedRef.current || !mounted) return;
            scannedRef.current = true;

            // Defer stop to avoid "scanner stopped" error inside callback
            setTimeout(async () => {
              try {
                if (scannerRef.current) {
                  await scannerRef.current.stop();
                  scannerRef.current = null;
                }
              } catch {
                // Ignore stop errors
              }
              onScanRef.current(decodedText);
            }, 0);
          },
          () => {
            // Ignore scan failures (no QR found in frame)
          }
        );
      } catch (err: unknown) {
        if (mounted) {
          if (err instanceof Error && err.toString().includes('NotAllowedError')) {
            setError('Camera permission denied. Please allow camera access.');
          } else {
            setError('Could not start camera. Please try manual entry.');
          }
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current && !scannedRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [ready]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
      <div className="w-full max-w-md rounded-2xl border border-gray-700 p-6 shadow-2xl" style={{ backgroundColor: '#1a1a2e' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2a2a3e' }}>
              <span className="text-xl">📷</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">Scan QR Code</h3>
              <p className="text-gray-500 text-xs">Position the QR code within the frame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="rounded-xl p-4 mb-4 border border-red-500/30" style={{ backgroundColor: 'rgba(127, 29, 29, 0.3)' }}>
            <p className="text-red-400 text-center text-sm">{error}</p>
          </div>
        ) : (
          <div className="rounded-xl p-3 mb-4 border border-accent-gold/20" style={{ backgroundColor: 'rgba(234, 179, 8, 0.05)' }}>
            <p className="text-accent-gold text-sm text-center font-medium">
              📱 Point your camera at the pass QR code
            </p>
          </div>
        )}

        {/* Scanner viewport */}
        <div className="rounded-xl overflow-hidden mb-5 border-2 border-gray-700" style={{ backgroundColor: '#000' }}>
          <div
            id={containerId.current}
            className="w-full"
            style={{ minHeight: '300px' }}
          />
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold uppercase text-sm transition-all border-2 border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10"
        >
          Cancel Scanning
        </button>
      </div>
    </div>
  );
}
