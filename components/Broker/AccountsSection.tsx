import { BrokerAccount } from '@/types/broker';

interface AccountsSectionProps {
  accounts: BrokerAccount[];
}

export default function AccountsSection({ accounts }: AccountsSectionProps) {
  return (
    <section id="accounts" className="content-section">
      <h2 className="section-title">账户类型与交易条件</h2>

      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>账户类型</th>
              <th>最低入金</th>
              <th>杠杆范围</th>
              <th>点差类型</th>
              <th>点差值</th>
              <th>佣金</th>
              <th>适合人群</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="font-semibold">{account.account_type}</td>
                <td>
                  <span className="text-primary-600 font-semibold">
                    ${account.min_deposit || 'N/A'}
                  </span>
                </td>
                <td>{account.max_leverage || '-'}</td>
                <td>{account.spread_type || '-'}</td>
                <td>
                  <span className="font-semibold">
                    {account.spread_value || '-'}
                  </span>
                </td>
                <td>{account.commission || '无'}</td>
                <td>
                  {account.suitable_for?.map((tag, index) => (
                    <span key={index} className="badge badge-info mr-1">
                      {tag}
                    </span>
                  )) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">✅ 新手推荐</h4>
          <p className="text-sm text-green-700">
            建议新手从最低入金要求的账户开始，熟悉平台后再升级到更高级账户。
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">⚡ 专业交易者</h4>
          <p className="text-sm text-orange-700">
            专业账户通常提供更低的点差和更高的杠杆，但需要更大的入金金额。
          </p>
        </div>
      </div>
    </section>
  );
}