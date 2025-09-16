import React from 'react';
import budgetEaseLogo from '../assets/budgetease logo.jpg'; // Adjust this path if you save the image elsewhere

const LogoHeader = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={budgetEaseLogo}
          alt="BudgetEase Logo"
          className="h-10 w-auto rounded-lg"
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          BudgetEase
        </h1>
      </div>
    </header>
  );
};

export default LogoHeader;

