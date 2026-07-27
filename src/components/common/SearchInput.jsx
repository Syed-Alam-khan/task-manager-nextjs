'use client';

import React from 'react';
import { IoSearchOutline, IoCloseCircle } from 'react-icons/io5';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className = '',
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <IoSearchOutline className="absolute left-3.5 text-slate-400 text-lg pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <IoCloseCircle className="text-lg" />
        </button>
      )}
    </div>
  );
}
