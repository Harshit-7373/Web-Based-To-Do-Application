import React from 'react';
import { LogOut, User, Bell, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
  };

  if (!state.currentUser) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">TB</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TaskBoard</h1>
            <p className="text-sm text-gray-600">Collaborative Task Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: state.currentUser.color }}
            >
              {state.currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{state.currentUser.username}</p>
              <p className="text-xs text-gray-500">{state.currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}