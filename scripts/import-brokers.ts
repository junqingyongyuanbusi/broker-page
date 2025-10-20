import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少必要的环境变量');
  console.error('请确保设置了 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 生成SEO友好的slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 生成Meta描述
function generateMetaDescription(broker: any): string {
  const regulations = broker.regulations || 'FCA/CySEC/ASIC';
  const spread = broker.spread || '1.6';
  const minDeposit = broker.min_deposit || '5';

  return `${broker.name}深度评测：${regulations}监管，EUR/USD点差${spread}点，$${minDeposit}起开户。详解监管牌照、交易成本、MT4/MT5平台、出入金流程及客户体验。`;
}

// 导入经纪商主数据
async function importBrokers() {
  console.log('📥 开始导入经纪商数据...');

  // 示例数据（实际使用时可以从CSV文件读取）
  const sampleBrokers = [
    {
      name: 'XM Trading',
      full_name: 'Trading Point of Financial Instruments Ltd',
      founded_year: 2009,
      headquarters: '塞浦路斯利马索尔',
      website_url: 'https://www.xm.com',
      min_deposit: 5,
      max_leverage: '1:888',
      spreads_from: '1.6点',
      overall_rating: 8.7,
      safety_rating: 9.2,
      cost_rating: 8.5,
      platform_rating: 8.8,
      service_rating: 9.0,
      withdrawal_speed_rating: 8.8,
    },
    {
      name: 'IC Markets',
      full_name: 'International Capital Markets Pty Ltd',
      founded_year: 2007,
      headquarters: '澳大利亚悉尼',
      website_url: 'https://www.icmarkets.com',
      min_deposit: 200,
      max_leverage: '1:500',
      spreads_from: '0.0点',
      overall_rating: 9.0,
      safety_rating: 9.3,
      cost_rating: 9.2,
      platform_rating: 9.0,
      service_rating: 8.5,
      withdrawal_speed_rating: 9.0,
    },
    {
      name: 'Pepperstone',
      full_name: 'Pepperstone Group Limited',
      founded_year: 2010,
      headquarters: '澳大利亚墨尔本',
      website_url: 'https://www.pepperstone.com',
      min_deposit: 200,
      max_leverage: '1:400',
      spreads_from: '0.0点',
      overall_rating: 8.9,
      safety_rating: 9.1,
      cost_rating: 9.0,
      platform_rating: 8.8,
      service_rating: 8.7,
      withdrawal_speed_rating: 8.9,
    },
  ];

  const brokerIds: Record<string, string> = {};

  for (const broker of sampleBrokers) {
    const slug = generateSlug(broker.name);
    const brokerData = {
      slug,
      name: broker.name,
      full_name: broker.full_name,
      founded_year: broker.founded_year,
      headquarters: broker.headquarters,
      website_url: broker.website_url,
      meta_title: `${broker.name}评测2025 - 最全面外汇经纪商分析【监管/点差/出金】`,
      meta_description: generateMetaDescription(broker),
      meta_keywords: [
        `${broker.name}评测`,
        `${broker.name}外汇`,
        `${broker.name}监管`,
        `${broker.name}点差`,
        `${broker.name}出金`,
        '外汇经纪商',
        'CFD交易',
        'MT4',
        'MT5',
      ],
      canonical_url: `https://yoursite.com/brokers/${slug}`,
      min_deposit: broker.min_deposit,
      max_leverage: broker.max_leverage,
      spreads_from: broker.spreads_from,
      overall_rating: broker.overall_rating,
      safety_rating: broker.safety_rating,
      cost_rating: broker.cost_rating,
      platform_rating: broker.platform_rating,
      service_rating: broker.service_rating,
      withdrawal_speed_rating: broker.withdrawal_speed_rating,
      status: 'published',
    };

    const { data, error } = await supabase
      .from('brokers')
      .upsert(brokerData, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`❌ 导入 ${broker.name} 失败:`, error.message);
    } else {
      console.log(`✅ 成功导入: ${broker.name}`);
      brokerIds[broker.name] = data.id;
    }
  }

  return brokerIds;
}

// 导入监管信息
async function importRegulations(brokerIds: Record<string, string>) {
  console.log('\n📥 导入监管信息...');

  const regulations = [
    // XM Trading
    {
      broker_name: 'XM Trading',
      regulator_name: 'CySEC',
      regulator_full_name: 'Cyprus Securities and Exchange Commission',
      license_number: '120/10',
      license_type: '零售外汇与CFD全牌照',
      protection_amount: '€20,000',
      tier: '一级监管',
      display_order: 1,
    },
    {
      broker_name: 'XM Trading',
      regulator_name: 'ASIC',
      regulator_full_name: 'Australian Securities and Investments Commission',
      license_number: '443670',
      license_type: '澳洲金融服务牌照',
      protection_amount: '主要货币对杠杆1:30',
      tier: '一级监管',
      display_order: 2,
    },
    // IC Markets
    {
      broker_name: 'IC Markets',
      regulator_name: 'ASIC',
      regulator_full_name: 'Australian Securities and Investments Commission',
      license_number: '335692',
      license_type: '澳洲金融服务牌照',
      protection_amount: '负余额保护',
      tier: '一级监管',
      display_order: 1,
    },
    {
      broker_name: 'IC Markets',
      regulator_name: 'CySEC',
      regulator_full_name: 'Cyprus Securities and Exchange Commission',
      license_number: '362/18',
      license_type: '欧盟投资服务牌照',
      protection_amount: '€20,000',
      tier: '一级监管',
      display_order: 2,
    },
  ];

  for (const reg of regulations) {
    const brokerId = brokerIds[reg.broker_name];
    if (!brokerId) continue;

    const { error } = await supabase.from('broker_regulations').insert({
      broker_id: brokerId,
      regulator_name: reg.regulator_name,
      regulator_full_name: reg.regulator_full_name,
      license_number: reg.license_number,
      license_type: reg.license_type,
      protection_amount: reg.protection_amount,
      tier: reg.tier,
      display_order: reg.display_order,
    });

    if (error) {
      console.error(`❌ 导入监管信息失败 (${reg.broker_name} - ${reg.regulator_name}):`, error.message);
    } else {
      console.log(`✅ 导入监管信息: ${reg.broker_name} - ${reg.regulator_name}`);
    }
  }
}

// 导入账户类型
async function importAccounts(brokerIds: Record<string, string>) {
  console.log('\n📥 导入账户类型...');

  const accounts = [
    // XM Trading
    {
      broker_name: 'XM Trading',
      account_type: 'Micro 微型账户',
      min_deposit: 5,
      max_leverage: '1:888',
      spread_type: '浮动点差',
      spread_value: '1.6点',
      commission: '无',
      suitable_for: ['新手交易者', '小资金交易者'],
      display_order: 1,
    },
    {
      broker_name: 'XM Trading',
      account_type: 'Standard 标准账户',
      min_deposit: 5,
      max_leverage: '1:888',
      spread_type: '浮动点差',
      spread_value: '1.6点',
      commission: '无',
      suitable_for: ['零售交易者'],
      display_order: 2,
    },
    {
      broker_name: 'XM Trading',
      account_type: 'XM Zero 零点差账户',
      min_deposit: 100,
      max_leverage: '1:500',
      spread_type: 'ECN零点差',
      spread_value: '0.0点起',
      commission: '$3.5/手',
      suitable_for: ['专业交易者', 'EA交易者'],
      display_order: 3,
    },
  ];

  for (const account of accounts) {
    const brokerId = brokerIds[account.broker_name];
    if (!brokerId) continue;

    const { error } = await supabase.from('broker_accounts').insert({
      broker_id: brokerId,
      account_type: account.account_type,
      min_deposit: account.min_deposit,
      max_leverage: account.max_leverage,
      spread_type: account.spread_type,
      spread_value: account.spread_value,
      commission: account.commission,
      suitable_for: account.suitable_for,
      display_order: account.display_order,
    });

    if (error) {
      console.error(`❌ 导入账户类型失败 (${account.broker_name} - ${account.account_type}):`, error.message);
    } else {
      console.log(`✅ 导入账户类型: ${account.broker_name} - ${account.account_type}`);
    }
  }
}

// 导入FAQ
async function importFAQs(brokerIds: Record<string, string>) {
  console.log('\n📥 导入FAQ...');

  const faqs = [
    {
      broker_name: 'XM Trading',
      question: 'XM Trading安全吗？是否有监管牌照？',
      answer: 'XM Trading非常安全。XM持有CySEC（塞浦路斯证券交易委员会）和ASIC（澳大利亚证券与投资委员会）等多个一级监管机构的牌照，提供客户资金隔离和投资者保护计划。',
      display_order: 1,
    },
    {
      broker_name: 'XM Trading',
      question: 'XM Trading最低入金金额是多少？',
      answer: 'XM Trading的Micro微型账户和Standard标准账户最低入金仅需$5，是行业内最低入金门槛之一。',
      display_order: 2,
    },
    {
      broker_name: 'XM Trading',
      question: 'XM Trading的出金需要多久？',
      answer: 'XM Trading的出金速度根据支付方式不同：电子钱包24小时内到账，信用卡1-3个工作日，银行电汇2-5个工作日。',
      display_order: 3,
    },
  ];

  for (const faq of faqs) {
    const brokerId = brokerIds[faq.broker_name];
    if (!brokerId) continue;

    const { error } = await supabase.from('broker_faqs').insert({
      broker_id: brokerId,
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
    });

    if (error) {
      console.error(`❌ 导入FAQ失败 (${faq.broker_name}):`, error.message);
    } else {
      console.log(`✅ 导入FAQ: ${faq.broker_name} - ${faq.question.substring(0, 30)}...`);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 开始批量导入经纪商数据\n');

  try {
    // 1. 导入经纪商主数据
    const brokerIds = await importBrokers();

    // 2. 导入关联数据
    await importRegulations(brokerIds);
    await importAccounts(brokerIds);
    await importFAQs(brokerIds);

    console.log('\n✨ 数据导入完成！');
    console.log('📊 总计导入:', Object.keys(brokerIds).length, '个经纪商');
  } catch (error) {
    console.error('\n❌ 导入过程中发生错误:', error);
  }
}

// 运行导入脚本
main();