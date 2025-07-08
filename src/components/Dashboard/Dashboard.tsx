import React from 'react';
import Header from '../Layout/Header';
import KanbanBoard from '../Board/KanbanBoard';
import ActivityLog from '../ActivityLog/ActivityLog';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <KanbanBoard />
        <ActivityLog />
      </div>
    </div>
  );
}