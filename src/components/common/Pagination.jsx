'use client';

import React from 'react';
import Button from './Button';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  totalItems,
  limit = 10,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems || currentPage * limit);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 border-t border-slate-100 dark:border-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {totalItems ? (
          <>
            Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{startItem}</span> to{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{endItem}</span> of{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span> items
          </>
        ) : (
          <>
            Page <span className="font-semibold text-slate-700 dark:text-slate-200">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage && currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={IoChevronBack}
        >
          Previous
        </Button>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage && currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={IoChevronForward}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
