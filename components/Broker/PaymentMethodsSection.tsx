import { BrokerPaymentMethod } from '@/types/broker';

interface PaymentMethodsSectionProps {
  paymentMethods: BrokerPaymentMethod[];
}

export default function PaymentMethodsSection({ paymentMethods }: PaymentMethodsSectionProps) {
  const getMethodIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'card':
        return '💳';
      case 'bank':
        return '🏦';
      case 'wallet':
        return '💰';
      case 'crypto':
        return '₿';
      default:
        return '💵';
    }
  };

  return (
    <section id="payment" className="content-section">
      <h2 className="section-title">出入金方式与流程</h2>

      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>支付方式</th>
              <th>最低金额</th>
              <th>最高金额</th>
              <th>入金时间</th>
              <th>出金时间</th>
              <th>费用</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => (
              <tr key={method.id}>
                <td>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getMethodIcon(method.method_type)}</span>
                    <span className="font-semibold">{method.method_name}</span>
                  </div>
                </td>
                <td>${method.min_amount || 'N/A'}</td>
                <td>${method.max_amount || '无限制'}</td>
                <td>
                  <span className="text-green-600 font-semibold">
                    {method.deposit_time || '-'}
                  </span>
                </td>
                <td>
                  <span className="text-orange-600 font-semibold">
                    {method.withdrawal_time || '-'}
                  </span>
                </td>
                <td>
                  <span className={method.deposit_fee === '免费' ? 'text-green-600 font-semibold' : ''}>
                    {method.deposit_fee || '免费'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">⚡ 最快入金</h4>
          <p className="text-sm text-green-700">
            电子钱包和加密货币通常提供即时到账服务
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">🔒 最安全</h4>
          <p className="text-sm text-blue-700">
            银行电汇虽然较慢，但最安全可靠
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">💡 小贴士</h4>
          <p className="text-sm text-orange-700">
            出金通常需要原路返回到入金方式
          </p>
        </div>
      </div>
    </section>
  );
}