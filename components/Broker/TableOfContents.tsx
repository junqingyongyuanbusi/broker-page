'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '公司概述与背景' },
    { id: 'regulation', title: '监管牌照分析' },
    { id: 'accounts', title: '账户类型与条件' },
    { id: 'products', title: '交易产品种类' },
    { id: 'payment', title: '出入金方式' },
    { id: 'pros-cons', title: '优势与劣势' },
    { id: 'faq', title: '常见问题解答' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // 顶部偏移量
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-500">
        📋 文章目录
      </h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className={`block py-2 px-3 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-primary-50 text-primary-600 font-semibold border-l-4 border-primary-500'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}