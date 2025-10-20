import { BrokerRegulation } from '@/types/broker';

interface RegulationSectionProps {
  regulations: BrokerRegulation[];
}

export default function RegulationSection({ regulations }: RegulationSectionProps) {
  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case '一级监管':
        return 'badge-success';
      case '二级监管':
        return 'badge-info';
      default:
        return 'badge-warning';
    }
  };

  return (
    <section id="regulation" className="content-section">
      <h2 className="section-title">监管牌照深度分析</h2>

      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>监管机构</th>
              <th>牌照类型</th>
              <th>注册号</th>
              <th>保护措施</th>
              <th>监管级别</th>
            </tr>
          </thead>
          <tbody>
            {regulations.map((reg) => (
              <tr key={reg.id}>
                <td>
                  <div>
                    <div className="font-semibold">{reg.regulator_name}</div>
                    {reg.regulator_full_name && (
                      <div className="text-sm text-gray-500">{reg.regulator_full_name}</div>
                    )}
                  </div>
                </td>
                <td>{reg.license_type || '-'}</td>
                <td>
                  <span className="font-mono text-primary-600">
                    {reg.license_number || '-'}
                  </span>
                </td>
                <td>
                  {reg.protection_amount ? (
                    <span className="font-semibold text-green-600">
                      {reg.protection_amount}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <span className={`badge ${getTierBadge(reg.tier)}`}>
                    {reg.tier || '未分级'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">🔍 监管说明</h4>
        <p className="text-sm text-blue-700">
          一级监管机构（如FCA、ASIC、CySEC）提供最高级别的投资者保护，包括资金隔离、负余额保护和补偿计划。
          请务必在监管机构官网验证牌照有效性。
        </p>
      </div>
    </section>
  );
}