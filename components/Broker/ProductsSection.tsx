import { BrokerProduct } from '@/types/broker';

interface ProductsSectionProps {
  products: BrokerProduct[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'forex':
      case '外汇':
        return '💱';
      case 'metals':
      case '贵金属':
        return '🥇';
      case 'crypto':
      case '加密货币':
        return '₿';
      case 'stocks':
      case '股票':
        return '📈';
      case 'indices':
      case '股指':
        return '📊';
      case 'commodities':
      case '大宗商品':
        return '🛢️';
      default:
        return '📦';
    }
  };

  return (
    <section id="products" className="content-section">
      <h2 className="section-title">交易产品种类</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">{getCategoryIcon(product.category)}</span>
              <h3 className="text-lg font-semibold text-gray-900">{product.category}</h3>
            </div>

            <div className="space-y-2 text-sm">
              {product.product_count && (
                <div>
                  <span className="text-gray-600">产品数量：</span>
                  <span className="font-semibold text-primary-600">{product.product_count}种</span>
                </div>
              )}

              {product.leverage && (
                <div>
                  <span className="text-gray-600">最高杠杆：</span>
                  <span className="font-semibold">{product.leverage}</span>
                </div>
              )}

              {product.product_list && product.product_list.length > 0 && (
                <div>
                  <span className="text-gray-600">主要产品：</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.product_list.slice(0, 5).map((item, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-white rounded text-xs">
                        {item}
                      </span>
                    ))}
                    {product.product_list.length > 5 && (
                      <span className="inline-block px-2 py-1 text-xs text-gray-500">
                        +{product.product_list.length - 5}更多
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}