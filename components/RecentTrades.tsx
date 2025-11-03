'use client';
import React from 'react';
import useOrderBookStore from '../store/orderBookStore';
import { formatNumber } from '../utils/format';
import { motion } from 'framer-motion';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function RecentTrades() {
  const trades = useOrderBookStore((s) => s.trades);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 dark:bg-gray-900 rounded-2xl shadow-lg p-5 font-sans border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
    >
      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className="text-blue-600 dark:text-blue-400">Recent Trades</span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/40 to-transparent"></div>
      </h3>

      <div className="space-y-1 text-sm max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {trades.length === 0 ? (
          <p className="text-gray-500 text-center py-5 text-sm">
            No recent trades yet.
          </p>
        ) : (
          trades.map((t, i) => (
            <motion.div
              key={t.timestamp + '-' + i}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex justify-between items-center px-3 py-2 rounded-xl bg-gray-50/40 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
            >
              {/* Price */}
              <div
                className={`w-28 font-semibold flex items-center gap-2 ${
                  t.isBuyerMaker ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {t.isBuyerMaker ? (
                  <ArrowDownCircle className="w-4 h-4" />
                ) : (
                  <ArrowUpCircle className="w-4 h-4" />
                )}
                {formatNumber(t.price)}
              </div>

              {/* Quantity */}
              <div className="w-20 text-right font-medium text-gray-800 dark:text-gray-200">
                {formatNumber(t.qty)}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-gray-500 dark:text-gray-400 w-24 text-right">
                {new Date(t.timestamp).toLocaleTimeString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}


