import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff1a88',
}

export const metadata: Metadata = {
  title: 'JARVIS AI',
  description: 'Your personal AI Agent — 145+ free tools',
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
      <body>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/service-worker.js')})}`
        }} />
      </body>
    </html>
  )
}
