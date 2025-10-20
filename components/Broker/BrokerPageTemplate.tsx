'use client';

import { Broker } from '@/types/broker';
import HeroSection from './HeroSection';
import RatingCards from './RatingCards';
import TableOfContents from './TableOfContents';
import RegulationSection from './RegulationSection';
import AccountsSection from './AccountsSection';
import ProductsSection from './ProductsSection';
import PaymentMethodsSection from './PaymentMethodsSection';
import FAQSection from './FAQSection';
import ProsConsSection from './ProsConsSection';
import BreadcrumbNav from './BreadcrumbNav';
import BackToTop from './BackToTop';

interface BrokerPageTemplateProps {
  broker: Broker;
}

export default function BrokerPageTemplate({ broker }: BrokerPageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <BreadcrumbNav broker={broker} />

      {/* Hero区域 */}
      <HeroSection broker={broker} />

      {/* 快速评分卡片 */}
      <div className="container mx-auto px-4 -mt-16 relative z-10 mb-8">
        <RatingCards broker={broker} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧目录 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <TableOfContents />
            </div>
          </aside>

          {/* 右侧内容 */}
          <main className="lg:col-span-3 space-y-8">
            {/* 公司概述 */}
            <section id="overview" className="content-section">
              <h2 className="section-title">公司概述与背景</h2>
              <div className="prose max-w-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">成立时间</h4>
                    <p className="text-2xl font-bold text-primary-600">
                      {broker.founded_year || 'N/A'}年
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">总部地点</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {broker.headquarters || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">最低入金</h4>
                    <p className="text-2xl font-bold text-primary-600">
                      ${broker.min_deposit || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">最高杠杆</h4>
                    <p className="text-2xl font-bold text-primary-600">
                      {broker.max_leverage || 'N/A'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {broker.full_name || broker.name}是一家{broker.founded_year ? `成立于${broker.founded_year}年的` : ''}国际外汇经纪商，
                  总部位于{broker.headquarters || '未知地区'}。公司提供外汇、贵金属、股指、大宗商品等多种交易产品，
                  致力于为全球交易者提供专业、安全、便捷的交易服务。
                </p>
              </div>
            </section>

            {/* 监管信息 */}
            {broker.regulations && broker.regulations.length > 0 && (
              <RegulationSection regulations={broker.regulations} />
            )}

            {/* 账户类型 */}
            {broker.accounts && broker.accounts.length > 0 && (
              <AccountsSection accounts={broker.accounts} />
            )}

            {/* 交易产品 */}
            {broker.products && broker.products.length > 0 && (
              <ProductsSection products={broker.products} />
            )}

            {/* 出入金方式 */}
            {broker.payment_methods && broker.payment_methods.length > 0 && (
              <PaymentMethodsSection paymentMethods={broker.payment_methods} />
            )}

            {/* 优缺点 */}
            {broker.pros_cons && broker.pros_cons.length > 0 && (
              <ProsConsSection prosCons={broker.pros_cons} />
            )}

            {/* FAQ */}
            {broker.faqs && broker.faqs.length > 0 && (
              <FAQSection faqs={broker.faqs} />
            )}

            {/* 风险提示 */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 风险提示</h4>
              <p className="text-yellow-700 text-sm">
                差价合约（CFD）是复杂的金融工具，由于杠杆作用具有快速亏损的高风险。
                大多数零售投资者账户在交易CFD时出现亏损。
                您应该考虑是否了解CFD的运作方式，以及是否有能力承担资金损失的高风险。
                本评测仅供参考，不构成投资建议。
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* 返回顶部按钮 */}
      <BackToTop />
    </div>
  );
}