import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Order Book Visualizer',
  description: 'Live order book using Binance WebSocket',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black-900 text-gray-100 min-h-screen">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}



