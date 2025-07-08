import React, { useState } from 'react';
import { User, Calendar, Flag, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Task, User as UserType } from '../../types';
import { useApp } from '../../context/AppContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onSmartAssign: (taskId: string) => void;
  isDragging?: boolean;
}

export default function TaskCard({ task, onEdit, onDelete, onSmartAssign, isDragging }: TaskCardProps) {
  const { state } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const assignedUser = state.users.find(user => user.id === task.assignedUser);
  const priorityColors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusColors = {
    'Todo': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    'Done': 'bg-green-100 text-green-800',
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-move hover:shadow-lg transition-all duration-200 transform ${
        isDragging ? 'rotate-3 scale-105 shadow-xl' : ''
      } ${isHovered ? 'scale-102' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
            <Flag className="w-3 h-3 inline mr-1" />
            {task.priority}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-150"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSmartAssign(task.id)}
            className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-150"
            title="Smart Assign"
          >
            <UserPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-150"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {assignedUser && (
            <div className="flex items-center space-x-1">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: assignedUser.color }}
              >
                {assignedUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500">{assignedUser.username}</span>
            </div>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(task.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}