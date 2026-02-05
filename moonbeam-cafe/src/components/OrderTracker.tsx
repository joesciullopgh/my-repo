'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Coffee,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  ArrowLeft,
  Receipt,
  Star,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatTime, formatDate } from '@/lib/utils';

interface OrderTrackerProps {
  onBack: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'confirmed', label: 'Order Confirmed', icon: Receipt },
  { status: 'preparing', label: 'Preparing', icon: Coffee },
  { status: 'ready', label: 'Ready for Pickup', icon: Package },
  { status: 'picked-up', label: 'Picked Up', icon: CheckCircle2 },
];

function getStatusIndex(status: OrderStatus): number {
  return STATUS_STEPS.findIndex((s) => s.status === status);
}

function OrderCard({ order, isActive }: { order: Order; isActive: boolean }) {
  const { updateOrderStatus } = useStore();
  const statusIndex = getStatusIndex(order.status);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isActive || order.status === 'ready' || order.status === 'picked-up') return;

    const interval = setInterval(() => {
      const now = new Date();
      const ready = new Date(order.estimatedReadyTime);
      const diff = ready.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Ready soon');
      } else {
        const minutes = Math.ceil(diff / 60000);
        setTimeLeft(`~${minutes} min`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, order.estimatedReadyTime, order.status]);

  return (
    <div className={`bg-white rounded-2xl border ${isActive ? 'border-indigo-200 shadow-lg shadow-indigo-100/50' : 'border-slate-200'} overflow-hidden`}>
      {/* Order Header */}
      <div className={`p-4 ${isActive ? 'bg-gradient-to-r from-indigo-950 to-indigo-900 text-white' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
              Order #{order.id.split('-')[1]}
            </p>
            <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
              {order.location.name.replace('Moonbeam Cafe - ', '')}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-xs ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
              {formatDate(new Date(order.createdAt))}
            </p>
            <p className={`text-sm font-bold ${isActive ? 'text-amber-400' : 'text-slate-900'}`}>
              {formatPrice(order.total)}
            </p>
          </div>
        </div>
        {isActive && order.status !== 'ready' && order.status !== 'picked-up' && (
          <div className="mt-3 flex items-center gap-2 text-amber-400">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Estimated: {timeLeft}</span>
          </div>
        )}
      </div>

      {/* Progress Tracker */}
      {isActive && order.status !== 'picked-up' && order.status !== 'cancelled' && (
        <div className="p-4">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-slate-200 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 to-amber-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: `${(statusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>

            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= statusIndex;
              const isCurrent = index === statusIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="relative flex flex-col items-center z-10">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                      backgroundColor: isCompleted ? '#1e1b4b' : '#f1f5f9',
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCurrent ? 'ring-4 ring-indigo-200' : ''
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium mt-2 text-center max-w-[70px] ${
                      isCompleted ? 'text-indigo-950' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Ready Message */}
          {order.status === 'ready' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-emerald-900">Your order is ready!</p>
              <p className="text-xs text-emerald-700 mt-1">
                Pick up at {order.location.name} for {order.pickupName}
              </p>
              <button
                onClick={() => updateOrderStatus(order.id, 'picked-up')}
                className="mt-3 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Mark as Picked Up
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Order Items */}
      <div className="px-4 pb-4">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-slate-600">
                {item.quantity}x {item.itemName}
              </span>
              <span className="text-slate-900 font-medium">
                {formatPrice(item.itemPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Location Info */}
        {isActive && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex-1 text-xs text-slate-500">
              <p className="font-medium text-slate-700">{order.location.name}</p>
              <p>{order.location.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTracker({ onBack }: OrderTrackerProps) {
  const { currentOrder, orderHistory } = useStore();

  const pastOrders = orderHistory.filter(
    (order) => order.status === 'picked-up' || order.status === 'cancelled'
  );

  const activeOrders = orderHistory.filter(
    (order) => order.status !== 'picked-up' && order.status !== 'cancelled'
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Your Orders</h1>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Active Orders
          </h2>
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} isActive={true} />
            ))}
          </div>
        </div>
      )}

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Past Orders
          </h2>
          <div className="space-y-3">
            {pastOrders.map((order) => (
              <OrderCard key={order.id} order={order} isActive={false} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {orderHistory.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No orders yet</h3>
          <p className="text-sm text-slate-500 mb-4">
            When you place an order, it will appear here
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-indigo-950 text-white rounded-xl text-sm font-medium hover:bg-indigo-900"
          >
            Browse Menu
          </button>
        </div>
      )}
    </div>
  );
}
