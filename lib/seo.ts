import { Broker } from '@/types/broker';

// 生成结构化数据
export function generateStructuredData(broker: Broker) {
  const schemas = [];

  // Review Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialProduct",
      "name": broker.name,
      "description": broker.meta_description,
      "brand": {
        "@type": "Brand",
        "name": broker.name
      },
      "aggregateRating": broker.overall_rating ? {
        "@type": "AggregateRating",
        "ratingValue": broker.overall_rating,
        "bestRating": "10",
        "worstRating": "1"
      } : undefined
    },
    "reviewRating": broker.overall_rating ? {
      "@type": "Rating",
      "ratingValue": broker.overall_rating,
      "bestRating": "10",
      "worstRating": "1"
    } : undefined,
    "author": {
      "@type": "Person",
      "name": "外汇评测专家团队"
    },
    "datePublished": broker.created_at,
    "dateModified": broker.updated_at,
    "reviewBody": broker.meta_description
  });

  // Organization Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": broker.name,
    "alternateName": broker.full_name,
    "url": broker.website_url,
    "logo": broker.logo_url,
    "foundingDate": broker.founded_year?.toString(),
    "address": broker.headquarters ? {
      "@type": "PostalAddress",
      "addressLocality": broker.headquarters
    } : undefined
  });

  // BreadcrumbList Schema
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "经纪商评测",
        "item": `${siteUrl}/brokers`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${broker.name}评测`,
        "item": `${siteUrl}/brokers/${broker.slug}`
      }
    ]
  });

  // 如果有FAQ数据，添加FAQ Schema
  if (broker.faqs && broker.faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": broker.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    schemas.push(faqSchema);
  }

  return schemas;
}

// 生成动态Sitemap
export async function generateSitemapXML(brokers: Array<{ slug: string; updated_at: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/brokers</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${brokers.map(broker => `
  <url>
    <loc>${siteUrl}/brokers/${broker.slug}</loc>
    <lastmod>${broker.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

  return xml;
}

// 生成Robots.txt
export function generateRobotsTxt() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

  return `# Robots.txt for ${siteUrl}
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Crawl delay for Googlebot
User-agent: Googlebot
Crawl-delay: 0

# Crawl delay for other bots
User-agent: Bingbot
Crawl-delay: 1

User-agent: Slurp
Crawl-delay: 1

User-agent: DuckDuckBot
Crawl-delay: 1

User-agent: Baiduspider
Crawl-delay: 1`;
}

// 清理和格式化Meta描述
export function formatMetaDescription(text: string, maxLength: number = 160): string {
  // 移除多余的空格和换行
  let cleaned = text.replace(/\s+/g, ' ').trim();

  // 如果超过最大长度，截断并添加省略号
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength - 3) + '...';
  }

  return cleaned;
}

// 生成面包屑导航数据
export function generateBreadcrumbs(broker: Broker) {
  return [
    { name: '首页', url: '/' },
    { name: '经纪商评测', url: '/brokers' },
    { name: `${broker.name}评测`, url: `/brokers/${broker.slug}` }
  ];
}