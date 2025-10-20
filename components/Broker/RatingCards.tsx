import { Broker } from '@/types/broker';

interface RatingCardsProps {
  broker: Broker;
}

export default function RatingCards({ broker }: RatingCardsProps) {
  const ratings = [
    {
      title: '综合评分',
      score: broker.overall_rating,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: '监管安全',
      score: broker.safety_rating,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '交易成本',
      score: broker.cost_rating,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '出金速度',
      score: broker.withdrawal_speed_rating,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {ratings.map((rating, index) => (
        <div
          key={rating.title}
          className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-all duration-200 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            {rating.title}
          </h3>
          <div className={`text-4xl font-bold ${rating.color} mb-1`}>
            {rating.score || 'N/A'}
          </div>
          <div className="text-sm text-gray-400">/ 10</div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${rating.bgColor} ${rating.color}`}
                style={{
                  width: `${(rating.score || 0) * 10}%`,
                  backgroundColor: rating.color.replace('text-', 'rgb(var(--tw-')
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}