import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'),
  title: {
    default: '外汇经纪商评测平台 - 专业的外汇交易商对比分析',
    template: '%s | 外汇经纪商评测平台',
  },
  description: '提供全面的外汇经纪商评测、监管牌照查询、点差对比、出金速度分析，帮助交易者选择最适合的外汇平台。',
  keywords: '外汇经纪商,外汇平台,外汇交易,CFD,监管牌照,点差对比,出金速度',
  authors: [{ name: '外汇评测专家团队' }],
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
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName: '外汇经纪商评测平台',
    title: '外汇经纪商评测平台 - 专业的外汇交易商对比分析',
    description: '提供全面的外汇经纪商评测、监管牌照查询、点差对比、出金速度分析',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '外汇经纪商评测平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '外汇经纪商评测平台',
    description: '提供全面的外汇经纪商评测、监管牌照查询、点差对比、出金速度分析',
    images: ['/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}