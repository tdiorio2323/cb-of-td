import React from 'react';
import { usePlatform } from '../../App';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Heart, UserPlus } from 'lucide-react';
import { Transaction } from '../../types';

const FanWalletPage: React.FC = () => {
  const { users, getTransactionsByUserId, creators } = usePlatform();

  // Get current fan user
  const currentUser = users.find(u => u.role === 'fan') || users[0];
  const transactions = getTransactionsByUserId(currentUser.id);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="text-green-400" size={20} />;
      case 'subscription':
        return <UserPlus className="text-purple-400" size={20} />;
      case 'tip':
        return <Heart className="text-pink-400" size={20} />;
      default:
        return <DollarSign className="text-gray-400" size={20} />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-1">Current Balance</p>
            <h2 className="text-5xl font-bold text-white">
              ${currentUser.balance.toFixed(2)}
            </h2>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <DollarSign size={40} className="text-white" />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Transaction History</h3>

        {transactions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-700">
              {transactions.map((transaction) => {
                const creator = transaction.relatedCreatorId
                  ? creators.find(c => c.id === transaction.relatedCreatorId)
                  : null;

                return (
                  <div
                    key={transaction.id}
                    className="p-4 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side: Icon + Description */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gray-700 rounded-full p-2">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {transaction.description}
                          </p>
                          {creator && (
                            <p className="text-gray-400 text-sm">@{creator.handle}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Right side: Amount */}
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getTransactionColor(transaction.amount)}`}>
                          {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-gray-500 text-xs capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <StatCard
          label="Total Spent"
          value={`$${transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
            .toFixed(2)}`}
          icon={<ArrowUpRight size={24} />}
          color="text-red-400"
        />
        <StatCard
          label="Subscriptions"
          value={transactions.filter(t => t.type === 'subscription').length}
          icon={<UserPlus size={24} />}
          color="text-purple-400"
        />
        <StatCard
          label="Tips Given"
          value={transactions.filter(t => t.type === 'tip').length}
          icon={<Heart size={24} />}
          color="text-pink-400"
        />
      </div>
    </div>
  );
};

export default FanWalletPage;

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className={color}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
