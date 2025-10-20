import { Broker } from '@/types/broker';
import Link from 'next/link';

interface BreadcrumbNavProps {
  broker: Broker;
}

export default function BreadcrumbNav({ broker }: BreadcrumbNavProps) {
  return (
    <nav className="bg-white border-b" aria-label="面包屑导航">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
              首页
            </Link>
          </li>
          <li className="text-gray-400">›</li>
          <li>
            <Link href="/brokers" className="text-gray-500 hover:text-primary-600 transition-colors">
              经纪商评测
            </Link>
          </li>
          <li className="text-gray-400">›</li>
          <li>
            <span className="text-gray-900 font-medium" aria-current="page">
              {broker.name}评测
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}