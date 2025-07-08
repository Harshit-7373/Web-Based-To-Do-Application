import React, { useState } from 'react';
import { Activity, Clock, User, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ActivityLog() {
  const { state } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const getUser = (userId: string) => {
    return state.users.find(user => user.id === userId);
  };

  const getActionIcon = (type: string) => {
    const icons = {
      create: '✨',
      update: '📝',
      delete: '🗑️',
      assign: '👤',
      move: '🔄',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getActionColor = (type: string) => {
    const colors = {
      create: 'bg-green-100 text-green-800',
      update: 'bg-blue-100 text-blue-800',
      delete: 'bg-red-100 text-red-800',
      assign: 'bg-purple-100 text-purple-800',
      move: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredActions = state.actions.filter(action => {
    if (filter === 'all') return true;
    return action.type === filter;
  });

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Activity Log
          </h2>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {filteredActions.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
            <option value="assign">Assigned</option>
            <option value="move">Moved</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredActions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No activities yet</p>
            <p className="text-sm mt-1">Actions will appear here as you work</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredActions.map((action) => {
              const user = getUser(action.userId);
              return (
                <div
                  key={action.id}
                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-150"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {user && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {user?.username || 'Unknown'}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getActionColor(action.type)}`}>
                          {getActionIcon(action.type)} {action.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 break-words">{action.details}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(action.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}