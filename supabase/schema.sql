-- ===================================================
-- 外汇经纪商SEO平台数据库结构
-- 使用Supabase PostgreSQL
-- ===================================================

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================
-- 1. 经纪商主表
-- ===================================================
CREATE TABLE IF NOT EXISTS brokers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  website_url TEXT,
  logo_url TEXT,

  -- SEO字段
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  meta_keywords TEXT[],
  canonical_url TEXT,
  og_image TEXT,

  -- 核心评分（满分10分）
  overall_rating DECIMAL(3,1) CHECK (overall_rating >= 0 AND overall_rating <= 10),
  safety_rating DECIMAL(3,1) CHECK (safety_rating >= 0 AND safety_rating <= 10),
  cost_rating DECIMAL(3,1) CHECK (cost_rating >= 0 AND cost_rating <= 10),
  platform_rating DECIMAL(3,1) CHECK (platform_rating >= 0 AND platform_rating <= 10),
  service_rating DECIMAL(3,1) CHECK (service_rating >= 0 AND service_rating <= 10),
  withdrawal_speed_rating DECIMAL(3,1) CHECK (withdrawal_speed_rating >= 0 AND withdrawal_speed_rating <= 10),

  -- 基础信息
  min_deposit DECIMAL(10,2),
  max_leverage TEXT,
  spreads_from TEXT,

  -- 状态
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_brokers_slug ON brokers(slug);
CREATE INDEX idx_brokers_status ON brokers(status);
CREATE INDEX idx_brokers_overall_rating ON brokers(overall_rating);

-- ===================================================
-- 2. 监管牌照表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  regulator_name TEXT NOT NULL,
  regulator_full_name TEXT,
  license_number TEXT,
  license_type TEXT,
  protection_amount TEXT,
  tier TEXT,
  details JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_regulations_broker_id ON broker_regulations(broker_id);

-- ===================================================
-- 3. 账户类型表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL,
  min_deposit DECIMAL(10,2),
  max_leverage TEXT,
  spread_type TEXT,
  spread_value TEXT,
  commission TEXT,
  suitable_for TEXT[],
  features JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_accounts_broker_id ON broker_accounts(broker_id);

-- ===================================================
-- 4. 交易产品表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  product_count INTEGER,
  product_list TEXT[],
  leverage TEXT,
  details JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_products_broker_id ON broker_products(broker_id);

-- ===================================================
-- 5. 出入金方式表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  method_type TEXT,
  min_amount DECIMAL(10,2),
  max_amount DECIMAL(10,2),
  deposit_time TEXT,
  withdrawal_time TEXT,
  deposit_fee TEXT,
  withdrawal_fee TEXT,
  supported_currencies TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_payment_methods_broker_id ON broker_payment_methods(broker_id);

-- ===================================================
-- 6. FAQ表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_faqs_broker_id ON broker_faqs(broker_id);

-- ===================================================
-- 7. 优缺点表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_pros_cons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pro', 'con')),
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_pros_cons_broker_id ON broker_pros_cons(broker_id);
CREATE INDEX idx_broker_pros_cons_type ON broker_pros_cons(type);

-- ===================================================
-- 8. 动态内容块表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  block_type TEXT NOT NULL,
  title TEXT,
  content JSONB NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_content_blocks_broker_id ON broker_content_blocks(broker_id);
CREATE INDEX idx_broker_content_blocks_section ON broker_content_blocks(broker_id, section_id);

-- ===================================================
-- 9. Schema结构化数据表
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_schema_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  schema_type TEXT NOT NULL,
  schema_data JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_schema_data_broker_id ON broker_schema_data(broker_id);

-- ===================================================
-- 10. 页面访问统计表（可选）
-- ===================================================
CREATE TABLE IF NOT EXISTS broker_page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_page_views_broker_id ON broker_page_views(broker_id);

-- ===================================================
-- 触发器：自动更新updated_at
-- ===================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brokers_updated_at
  BEFORE UPDATE ON brokers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================================
-- RLS（行级安全）策略
-- ===================================================

-- 启用RLS
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_pros_cons ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_schema_data ENABLE ROW LEVEL SECURITY;

-- 公开读取策略（所有人都可以读取已发布的内容）
CREATE POLICY "Public brokers are viewable by everyone"
  ON brokers FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public broker regulations are viewable by everyone"
  ON broker_regulations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_regulations.broker_id
    AND brokers.status = 'published'
  ));

CREATE POLICY "Public broker accounts are viewable by everyone"
  ON broker_accounts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_accounts.broker_id
    AND brokers.status = 'published'
  ));

CREATE POLICY "Public broker products are viewable by everyone"
  ON broker_products FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_products.broker_id
    AND brokers.status = 'published'
  ));

CREATE POLICY "Public broker payment methods are viewable by everyone"
  ON broker_payment_methods FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_payment_methods.broker_id
    AND brokers.status = 'published'
  ));

CREATE POLICY "Public broker FAQs are viewable by everyone"
  ON broker_faqs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_faqs.broker_id
    AND brokers.status = 'published'
  ));

CREATE POLICY "Public broker pros cons are viewable by everyone"
  ON broker_pros_cons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_pros_cons.broker_id
    AND brokers.status = 'published'
  ));

CREATE POLICY "Public broker content blocks are viewable by everyone"
  ON broker_content_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_content_blocks.broker_id
    AND brokers.status = 'published'
  ));

CREATE POLICY "Public broker schema data are viewable by everyone"
  ON broker_schema_data FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brokers
    WHERE brokers.id = broker_schema_data.broker_id
    AND brokers.status = 'published'
  ));

-- ===================================================
-- 示例数据（可选）
-- ===================================================
-- 插入一个示例经纪商数据，用于测试
/*
INSERT INTO brokers (
  slug, name, full_name, founded_year, headquarters,
  meta_title, meta_description, meta_keywords,
  overall_rating, safety_rating, cost_rating, platform_rating, service_rating,
  min_deposit, max_leverage, spreads_from
) VALUES (
  'xm-trading',
  'XM Trading',
  'Trading Point of Financial Instruments Ltd',
  2009,
  '塞浦路斯利马索尔',
  'XM Trading评测2025 - 最全面外汇经纪商分析【监管/点差/出金】',
  'XM Trading深度评测：FCA/CySEC/ASIC三重监管，EUR/USD点差1.6点，$5起开户。详解监管牌照、交易成本、MT4/MT5平台、出入金流程及客服体验。',
  ARRAY['XM Trading评测', 'XM外汇经纪商', 'XM监管牌照', 'XM点差', 'XM出金速度'],
  8.7, 9.2, 8.5, 8.8, 9.0,
  5.00, '1:888', '1.6点'
);
*/