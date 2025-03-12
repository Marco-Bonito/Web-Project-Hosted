// src/app/layout.tsx
import Navigation from '@/components/Navigation';
import '../globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>TeachAndStay</title>
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
