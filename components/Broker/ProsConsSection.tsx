import { BrokerProsCons } from '@/types/broker';

interface ProsConsSectionProps {
  prosCons: BrokerProsCons[];
}

export default function ProsConsSection({ prosCons }: ProsConsSectionProps) {
  const pros = prosCons.filter(item => item.type === 'pro');
  const cons = prosCons.filter(item => item.type === 'con');

  return (
    <section id="pros-cons" className="content-section">
      <h2 className="section-title">优势与劣势分析</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 优势 */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">✅</span> 核心优势
          </h3>
          <ul className="space-y-3">
            {pros.map((item) => (
              <li key={item.id} className="flex items-start">
                <span className="text-green-500 font-bold mr-2 mt-1">✓</span>
                <span className="text-green-800">{item.content}</span>
              </li>
            ))}
            {pros.length === 0 && (
              <li className="text-green-700 italic">暂无数据</li>
            )}
          </ul>
        </div>

        {/* 劣势 */}
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">⚠️</span> 需要注意
          </h3>
          <ul className="space-y-3">
            {cons.map((item) => (
              <li key={item.id} className="flex items-start">
                <span className="text-red-500 font-bold mr-2 mt-1">✗</span>
                <span className="text-red-800">{item.content}</span>
              </li>
            ))}
            {cons.length === 0 && (
              <li className="text-red-700 italic">暂无数据</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>提示：</strong>没有完美的经纪商，选择时请根据自身需求权衡利弊。
        </p>
      </div>
    </section>
  );
}