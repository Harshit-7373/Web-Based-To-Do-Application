export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assignedUser: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface Action {
  id: string;
  type: 'create' | 'update' | 'delete' | 'assign' | 'move';
  taskId: string;
  userId: string;
  timestamp: Date;
  details: string;
  oldStatus?: string;
  newStatus?: string;
}

export interface ConflictData {
  taskId: string;
  localVersion: Task;
  remoteVersion: Task;
  timestamp: Date;
}