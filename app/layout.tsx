import type { Metadata, Viewport } from 'next'
import './globals.css'

// 1. Viewport को अलग से एक्सपोर्ट करना ज़रूरी है (यही आपकी स्क्रीन फिट करेगा)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff1a88',
}

// 2. Metadata में से themeColor और viewport को हटा दिया गया है
export const metadata: Metadata = {
  title: 'JARVIS AI',
  description: 'Your personal AI Agent — 145+ free tools, Hindi + English',
  manifest: '/manifest.json',
  appleWebApp: { 
    capable: true, 
    statusBarStyle: 'black-translucent', 
    title: 'JARVIS' 
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        height: '100dvh', // इससे ऐप फोन की स्क्रीन पर ऊपर-नीचे से कटेगा नहीं
        overflow: 'hidden' 
      }}>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/service-worker.js')})}`
        }} />
      </body>
    </html>
  )
} 
