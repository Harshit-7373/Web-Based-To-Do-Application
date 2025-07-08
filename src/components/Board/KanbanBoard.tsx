import React, { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import { Task, Action } from '../../types';
import { useApp } from '../../context/AppContext';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import ConflictModal from './ConflictModal';

const columns = [
  { id: 'Todo', title: 'To Do', color: 'bg-blue-50 border-blue-200' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-purple-50 border-purple-200' },
  { id: 'Done', title: 'Done', color: 'bg-green-50 border-green-200' },
];

export default function KanbanBoard() {
  const { state, dispatch } = useApp();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDraggedOver(status);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      const updatedTask = {
        ...draggedTask,
        status: newStatus as 'Todo' | 'In Progress' | 'Done',
        updatedAt: new Date(),
        version: draggedTask.version + 1,
      };

      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

      // Log the action
      const action: Action = {
        id: Date.now().toString(),
        type: 'move',
        taskId: draggedTask.id,
        userId: state.currentUser!.id,
        timestamp: new Date(),
        details: `Moved task "${draggedTask.title}" from ${draggedTask.status} to ${newStatus}`,
        oldStatus: draggedTask.status,
        newStatus,
      };
      dispatch({ type: 'ADD_ACTION', payload: action });

      // Simulate conflict detection (10% chance)
      if (Math.random() < 0.1) {
        const conflictData = {
          taskId: draggedTask.id,
          localVersion: updatedTask,
          remoteVersion: {
            ...updatedTask,
            title: updatedTask.title + ' (Remote)',
            description: updatedTask.description + ' - Modified by another user',
            version: updatedTask.version + 1,
          },
          timestamp: new Date(),
        };
        dispatch({ type: 'ADD_CONFLICT', payload: conflictData });
      }
    }

    setDraggedTask(null);
    setDraggedOver(null);
  };

  const handleCreateTask = (status: string) => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      dispatch({ type: 'DELETE_TASK', payload: taskId });

      const action: Action = {
        id: Date.now().toString(),
        type: 'delete',
        taskId,
        userId: state.currentUser!.id,
        timestamp: new Date(),
        details: `Deleted task "${task.title}"`,
      };
      dispatch({ type: 'ADD_ACTION', payload: action });
    }
  };

  const handleSmartAssign = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Count active tasks per user
    const userTaskCounts = state.users.reduce((acc, user) => {
      acc[user.id] = state.tasks.filter(t => 
        t.assignedUser === user.id && t.status !== 'Done'
      ).length;
      return acc;
    }, {} as Record<string, number>);

    // Find user with fewest active tasks
    const smartAssignUser = state.users.reduce((prev, current) => 
      userTaskCounts[current.id] < userTaskCounts[prev.id] ? current : prev
    );

    const updatedTask = {
      ...task,
      assignedUser: smartAssignUser.id,
      updatedAt: new Date(),
      version: task.version + 1,
    };

    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

    const action: Action = {
      id: Date.now().toString(),
      type: 'assign',
      taskId,
      userId: state.currentUser!.id,
      timestamp: new Date(),
      details: `Smart assigned task "${task.title}" to ${smartAssignUser.username}`,
    };
    dispatch({ type: 'ADD_ACTION', payload: action });
  };

  const getTasksForColumn = (status: string) => {
    return state.tasks.filter(task => task.status === status);
  };

  return (
    <div className="flex-1 p-6 overflow-x-auto">
      <div className="flex space-x-6 min-w-max">
        {columns.map(column => (
          <div
            key={column.id}
            className={`flex-1 min-w-80 ${column.color} rounded-lg border-2 border-dashed transition-all duration-200 ${
              draggedOver === column.id ? 'border-blue-400 bg-blue-100' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{column.title}</h2>
                <div className="flex items-center space-x-2">
                  <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                    {getTasksForColumn(column.id).length}
                  </span>
                  <button
                    onClick={() => handleCreateTask(column.id)}
                    className="bg-white text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 group">
                {getTasksForColumn(column.id).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="group"
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onSmartAssign={handleSmartAssign}
                      isDragging={draggedTask?.id === task.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={(taskData) => {
            if (editingTask) {
              const updatedTask = {
                ...editingTask,
                ...taskData,
                updatedAt: new Date(),
                version: editingTask.version + 1,
              };
              dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

              const action: Action = {
                id: Date.now().toString(),
                type: 'update',
                taskId: editingTask.id,
                userId: state.currentUser!.id,
                timestamp: new Date(),
                details: `Updated task "${updatedTask.title}"`,
              };
              dispatch({ type: 'ADD_ACTION', payload: action });
            } else {
              const newTask: Task = {
                id: Date.now().toString(),
                ...taskData,
                assignedUser: state.currentUser!.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
              };
              dispatch({ type: 'ADD_TASK', payload: newTask });

              const action: Action = {
                id: Date.now().toString(),
                type: 'create',
                taskId: newTask.id,
                userId: state.currentUser!.id,
                timestamp: new Date(),
                details: `Created task "${newTask.title}"`,
              };
              dispatch({ type: 'ADD_ACTION', payload: action });
            }
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {state.conflicts.length > 0 && (
        <ConflictModal
          isOpen={isConflictModalOpen}
          conflicts={state.conflicts}
          onResolve={(taskId, resolution) => {
            const conflict = state.conflicts.find(c => c.taskId === taskId);
            if (conflict) {
              const resolvedTask = resolution === 'local' ? conflict.localVersion : conflict.remoteVersion;
              dispatch({ type: 'UPDATE_TASK', payload: resolvedTask });
              dispatch({ type: 'RESOLVE_CONFLICT', payload: taskId });
            }
          }}
          onClose={() => setIsConflictModalOpen(false)}
        />
      )}

      {state.conflicts.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setIsConflictModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Resolve Conflicts ({state.conflicts.length})</span>
          </button>
        </div>
      )}
    </div>
  );
}