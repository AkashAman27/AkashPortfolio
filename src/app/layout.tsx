import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Akash Portfolio - Full Stack Developer & AI Enthusiast',
  description: 'Portfolio of Akash - Full Stack Developer specializing in modern web technologies, AI/ML, and innovative digital solutions.',
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'AI', 'Machine Learning', 'Web Development'],
  authors: [{ name: 'Akash' }],
  creator: 'Akash',
  publisher: 'Akash',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://akash-portfolio.vercel.app'),
  openGraph: {
    title: 'Akash Portfolio - Full Stack Developer & AI Enthusiast',
    description: 'Portfolio of Akash - Full Stack Developer specializing in modern web technologies, AI/ML, and innovative digital solutions.',
    url: 'https://akash-portfolio.vercel.app',
    siteName: 'Akash Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}