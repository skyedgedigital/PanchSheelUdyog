'use client';
import View from '@/components/fleet-manager/otherCompliances/view';
import Create from '@/components/fleet-manager/otherCompliances/create';
import React, { useState } from 'react';

const Page = () => {
  const [activeTab, setActiveTab] = useState('create');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div>
        <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
          Other Compliances
        </h1>
        <ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400'>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('create')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'create'
                  ? 'text-green-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Compliances Entry
            </button>
          </li>
          <li className='me-2'>
            <button
              onClick={() => handleTabClick('view')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'view'
                  ? 'text-blue-600 bg-gray-100'
                  : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
              }`}
            >
              View Entries
            </button>
          </li>
        </ul>
        <div className='tab-content'>
          {activeTab === 'create' && <Create />}
          {activeTab === 'view' && <View />}
        </div>
      </div>
    </>
  );
};

export default Page;
