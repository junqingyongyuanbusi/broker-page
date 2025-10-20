import { Broker } from '@/types/broker';

interface HeroSectionProps {
  broker: Broker;
}

export default function HeroSection({ broker }: HeroSectionProps) {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="gradient-hero text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {broker.name} 外汇经纪商深度评测【2025最新】
          </h1>
          <p className="text-xl opacity-90 mb-6 animate-fade-in animation-delay-200">
            {broker.meta_description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm opacity-80 animate-fade-in animation-delay-400">
            <span>📅 最后更新：{currentDate}</span>
            <span>⏱️ 阅读时长：约15分钟</span>
            <span>📊 数据来源：官方网站与监管机构</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 Q720,0 1440,50 L1440,100 L0,100 Z" fill="rgb(249, 250, 251)" />
        </svg>
      </div>
    </section>
  );
}