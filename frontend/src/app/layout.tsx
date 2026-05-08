import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Work Log | Professional Time Tracker',
  description: 'Track your work sessions, analyze productivity, and generate reports.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f1117] text-slate-200 min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1d27',
              color: '#e2e8f0',
              border: '1px solid #2a2d3a',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  );
}
