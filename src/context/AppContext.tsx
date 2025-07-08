import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Task, Action, ConflictData } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  actions: Action[];
  conflicts: ConflictData[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_ACTION'; payload: Action }
  | { type: 'SET_ACTIONS'; payload: Action[] }
  | { type: 'ADD_CONFLICT'; payload: ConflictData }
  | { type: 'RESOLVE_CONFLICT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  currentUser: null,
  users: [],
  tasks: [],
  actions: [],
  conflicts: [],
  isAuthenticated: false,
  isLoading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, currentUser: null, isAuthenticated: false };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_ACTION':
      return {
        ...state,
        actions: [action.payload, ...state.actions].slice(0, 20),
      };
    case 'SET_ACTIONS':
      return { ...state, actions: action.payload };
    case 'ADD_CONFLICT':
      return { ...state, conflicts: [...state.conflicts, action.payload] };
    case 'RESOLVE_CONFLICT':
      return {
        ...state,
        conflicts: state.conflicts.filter(conflict => conflict.taskId !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    const storedTasks = localStorage.getItem('tasks');
    const storedActions = localStorage.getItem('actions');
    const storedUsers = localStorage.getItem('users');

    if (storedUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: JSON.parse(storedUser) });
    }

    if (storedTasks) {
      const tasks = JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }

    if (storedActions) {
      const actions = JSON.parse(storedActions).map((action: any) => ({
        ...action,
        timestamp: new Date(action.timestamp),
      }));
      dispatch({ type: 'SET_ACTIONS', payload: actions });
    }

    if (storedUsers) {
      dispatch({ type: 'SET_USERS', payload: JSON.parse(storedUsers) });
    } else {
      // Initialize with some demo users
      const demoUsers = [
        { id: '1', username: 'Alice', email: 'alice@example.com', color: '#3B82F6' },
        { id: '2', username: 'Bob', email: 'bob@example.com', color: '#8B5CF6' },
        { id: '3', username: 'Charlie', email: 'charlie@example.com', color: '#10B981' },
      ];
      dispatch({ type: 'SET_USERS', payload: demoUsers });
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    }
  }, [state.currentUser]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  useEffect(() => {
    localStorage.setItem('actions', JSON.stringify(state.actions));
  }, [state.actions]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(state.users));
  }, [state.users]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};