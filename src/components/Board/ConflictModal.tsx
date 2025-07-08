import React from 'react';
import { X, AlertTriangle, User, Calendar } from 'lucide-react';
import { ConflictData } from '../../types';
import { useApp } from '../../context/AppContext';

interface ConflictModalProps {
  isOpen: boolean;
  conflicts: ConflictData[];
  onResolve: (taskId: string, resolution: 'local' | 'remote') => void;
  onClose: () => void;
}

export default function ConflictModal({ isOpen, conflicts, onResolve, onClose }: ConflictModalProps) {
  const { state } = useApp();

  if (!isOpen || conflicts.length === 0) return null;

  const conflict = conflicts[0]; // Handle one conflict at a time

  const getUser = (userId: string) => {
    return state.users.find(user => user.id === userId);
  };

  const localUser = getUser(conflict.localVersion.assignedUser);
  const remoteUser = getUser(conflict.remoteVersion.assignedUser);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Conflict Detected</h2>
                <p className="text-gray-600">Multiple users have modified the same task</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local Version */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Your Version</h3>
                <span className="text-sm text-blue-600">Local Changes</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900 bg-white p-2 rounded border">
                    {conflict.localVersion.title}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-white p-2 rounded border min-h-[80px]">
                    {conflict.localVersion.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <p className="text-gray-900 bg-white p-2 rounded border">
                      {conflict.localVersion.status}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <p className="text-gray-900 bg-white p-2 rounded border">
                      {conflict.localVersion.priority}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <div className="bg-white p-2 rounded border flex items-center space-x-2">
                    {localUser && (
                      <>
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: localUser.color }}
                        >
                          {localUser.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900">{localUser.username}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Modified: {new Date(conflict.localVersion.updatedAt).toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={() => onResolve(conflict.taskId, 'local')}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Keep Your Version
              </button>
            </div>

            {/* Remote Version */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-800">Remote Version</h3>
                <span className="text-sm text-purple-600">Server Changes</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900 bg-white p-2 rounded border">
                    {conflict.remoteVersion.title}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-white p-2 rounded border min-h-[80px]">
                    {conflict.remoteVersion.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <p className="text-gray-900 bg-white p-2 rounded border">
                      {conflict.remoteVersion.status}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <p className="text-gray-900 bg-white p-2 rounded border">
                      {conflict.remoteVersion.priority}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <div className="bg-white p-2 rounded border flex items-center space-x-2">
                    {remoteUser && (
                      <>
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: remoteUser.color }}
                        >
                          {remoteUser.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900">{remoteUser.username}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Modified: {new Date(conflict.remoteVersion.updatedAt).toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={() => onResolve(conflict.taskId, 'remote')}
                className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Accept Remote Version
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Choose Wisely</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This action cannot be undone. Review both versions carefully before making your choice.
                  The selected version will overwrite the other permanently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}