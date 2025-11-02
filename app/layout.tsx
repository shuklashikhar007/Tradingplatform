import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Order Book Visualizer',
  description: 'Live order book using Binance WebSocket',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen p-6 bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}

