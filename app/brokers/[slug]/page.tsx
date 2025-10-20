import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { Broker } from '@/types/broker';
import BrokerPageTemplate from '@/components/Broker/BrokerPageTemplate';
import { generateStructuredData } from '@/lib/seo';

interface PageProps {
  params: {
    slug: string;
  };
}

// 生成静态路径（构建时）
export async function generateStaticParams() {
  const supabase = createServerClient();

  // 获取所有已发布的经纪商
  const { data: brokers, error } = await supabase
    .from('brokers')
    .select('slug')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching broker slugs:', error);
    return [];
  }

  return brokers?.map((broker) => ({
    slug: broker.slug,
  })) || [];
}

// 生成动态Meta标签
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerClient();

  const { data: broker } = await supabase
    .from('brokers')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!broker) {
    return {
      title: '页面未找到',
      description: '您访问的页面不存在或已被删除',
    };
  }

  return {
    title: broker.meta_title,
    description: broker.meta_description,
    keywords: broker.meta_keywords?.join(', '),
    alternates: {
      canonical: broker.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/brokers/${broker.slug}`,
    },
    openGraph: {
      title: broker.meta_title,
      description: broker.meta_description,
      url: broker.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/brokers/${broker.slug}`,
      siteName: '外汇经纪商评测平台',
      images: broker.og_image ? [
        {
          url: broker.og_image,
          width: 1200,
          height: 630,
          alt: broker.name,
        }
      ] : undefined,
      locale: 'zh_CN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: broker.meta_title,
      description: broker.meta_description,
      images: broker.og_image ? [broker.og_image] : undefined,
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
  };
}

// 页面组件
export default async function BrokerDetailPage({ params }: PageProps) {
  const supabase = createServerClient();

  // 获取完整的经纪商数据（包括关联表）
  const { data: broker, error } = await supabase
    .from('brokers')
    .select(`
      *,
      regulations: broker_regulations(*, display_order),
      accounts: broker_accounts(*, display_order),
      products: broker_products(*, display_order),
      payment_methods: broker_payment_methods(*, display_order),
      faqs: broker_faqs(*, display_order),
      pros_cons: broker_pros_cons(*, display_order),
      content_blocks: broker_content_blocks(*, display_order),
      schema_data: broker_schema_data(*)
    `)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error || !broker) {
    console.error('Error fetching broker:', error);
    notFound();
  }

  // 按display_order排序关联数据
  if (broker.regulations) {
    broker.regulations.sort((a: any, b: any) => a.display_order - b.display_order);
  }
  if (broker.accounts) {
    broker.accounts.sort((a: any, b: any) => a.display_order - b.display_order);
  }
  if (broker.products) {
    broker.products.sort((a: any, b: any) => a.display_order - b.display_order);
  }
  if (broker.payment_methods) {
    broker.payment_methods.sort((a: any, b: any) => a.display_order - b.display_order);
  }
  if (broker.faqs) {
    broker.faqs.sort((a: any, b: any) => a.display_order - b.display_order);
  }
  if (broker.pros_cons) {
    broker.pros_cons.sort((a: any, b: any) => a.display_order - b.display_order);
  }
  if (broker.content_blocks) {
    broker.content_blocks.sort((a: any, b: any) => a.display_order - b.display_order);
  }

  // 构建结构化数据
  const structuredData = generateStructuredData(broker as Broker);

  return (
    <>
      {/* 注入结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* 页面主体 */}
      <BrokerPageTemplate broker={broker as Broker} />
    </>
  );
}

// 配置ISR（增量静态再生）
export const revalidate = 3600; // 每小时重新验证
export const dynamicParams = true; // 允许生成未预渲染的页面