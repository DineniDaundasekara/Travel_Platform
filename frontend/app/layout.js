import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/AuthContext';

export const metadata = {
  title: 'Wanderlust — Curated Travel Experiences',
  description: 'Discover and share extraordinary travel experiences from passionate local guides worldwide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0d0d0d',
                color: '#faf8f5',
                borderRadius: '4px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                padding: '12px 18px',
                border: '1px solid #2a2a2a',
              },
              success: { iconTheme: { primary: '#c9973a', secondary: '#0d0d0d' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
