// 经纪商基础信息
export interface Broker {
  id: string;
  slug: string;
  name: string;
  full_name?: string;
  founded_year?: number;
  headquarters?: string;
  website_url?: string;
  logo_url?: string;

  // SEO字段
  meta_title: string;
  meta_description: string;
  meta_keywords?: string[];
  canonical_url?: string;
  og_image?: string;

  // 核心评分
  overall_rating?: number;
  safety_rating?: number;
  cost_rating?: number;
  platform_rating?: number;
  service_rating?: number;
  withdrawal_speed_rating?: number;

  // 基础信息
  min_deposit?: number;
  max_leverage?: string;
  spreads_from?: string;

  // 状态
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;

  // 关联数据
  regulations?: BrokerRegulation[];
  accounts?: BrokerAccount[];
  products?: BrokerProduct[];
  payment_methods?: BrokerPaymentMethod[];
  faqs?: BrokerFAQ[];
  pros_cons?: BrokerProsCons[];
  content_blocks?: BrokerContentBlock[];
  schema_data?: BrokerSchemaData[];
}

// 监管牌照
export interface BrokerRegulation {
  id: string;
  broker_id: string;
  regulator_name: string;
  regulator_full_name?: string;
  license_number?: string;
  license_type?: string;
  protection_amount?: string;
  tier?: string;
  details?: any;
  display_order: number;
}

// 账户类型
export interface BrokerAccount {
  id: string;
  broker_id: string;
  account_type: string;
  min_deposit?: number;
  max_leverage?: string;
  spread_type?: string;
  spread_value?: string;
  commission?: string;
  suitable_for?: string[];
  features?: any;
  display_order: number;
}

// 交易产品
export interface BrokerProduct {
  id: string;
  broker_id: string;
  category: string;
  product_count?: number;
  product_list?: string[];
  leverage?: string;
  details?: any;
  display_order: number;
}

// 出入金方式
export interface BrokerPaymentMethod {
  id: string;
  broker_id: string;
  method_name: string;
  method_type?: string;
  min_amount?: number;
  max_amount?: number;
  deposit_time?: string;
  withdrawal_time?: string;
  deposit_fee?: string;
  withdrawal_fee?: string;
  supported_currencies?: string[];
  display_order: number;
}

// FAQ
export interface BrokerFAQ {
  id: string;
  broker_id: string;
  question: string;
  answer: string;
  display_order: number;
}

// 优缺点
export interface BrokerProsCons {
  id: string;
  broker_id: string;
  type: 'pro' | 'con';
  content: string;
  display_order: number;
}

// 内容块
export interface BrokerContentBlock {
  id: string;
  broker_id: string;
  section_id: string;
  block_type: string;
  title?: string;
  content: any;
  display_order: number;
}

// Schema结构化数据
export interface BrokerSchemaData {
  id: string;
  broker_id: string;
  schema_type: string;
  schema_data: any;
  enabled: boolean;
}