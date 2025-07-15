import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit2, Save, Calendar, Filter, Wifi, WifiOff } from 'lucide-react';
import TodoAPI from './services/api';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });

  // Load todos and stats from backend
  useEffect(() => {
    loadTodos();
    loadStats();
    checkBackendConnection();
  }, [filter]);

  const checkBackendConnection = async () => {
    try {
      await TodoAPI.healthCheck();
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
      console.error('Backend connection failed:', error);
    }
  };

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedTodos = await TodoAPI.getAllTodos(filter);
      setTodos(fetchedTodos);
      setIsOnline(true);
    } catch (error) {
      setError('Failed to load todos. Using local data.');
      setIsOnline(false);
      console.error('Error loading todos:', error);
      // Fallback to sample data if backend is not available
      const sampleTodos = [
        {
          _id: '1',
          text: 'Learn React hooks',
          completed: false,
          priority: 'high',
          dueDate: '2025-07-20',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          text: 'Set up MongoDB connection',
          completed: true,
          priority: 'medium',
          dueDate: '2025-07-18',
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          text: 'Build user authentication',
          completed: false,
          priority: 'low',
          dueDate: '2025-07-25',
          createdAt: new Date().toISOString()
        }
      ];
      setTodos(sampleTodos);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const fetchedStats = await TodoAPI.getStats();
      setStats(fetchedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Calculate stats from current todos if backend fails
      const calculatedStats = {
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        pending: todos.filter(t => !t.completed).length,
        overdue: todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
      };
      setStats(calculatedStats);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        setLoading(true);
        setError('');
        const todoData = {
          text: newTodo,
          priority,
          dueDate: dueDate || null
        };
        
        if (isOnline) {
          const newTodoItem = await TodoAPI.createTodo(todoData);
          setTodos([newTodoItem, ...todos]);
          await loadStats();
        } else {
          // Fallback for offline mode
          const newTodoItem = {
            _id: Date.now().toString(),
            ...todoData,
            completed: false,
            createdAt: new Date().toISOString()
          };
          setTodos([newTodoItem, ...todos]);
        }
        
        setNewTodo('');
        setPriority('medium');
        setDueDate('');
      } catch (error) {
        setError('Failed to add todo');
        console.error('Error adding todo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTodo = async (id) => {
    try {
      setError('');
      const todo = todos.find(t => t._id === id);
      const updatedCompleted = !todo.completed;
      
      if (isOnline) {
        await TodoAPI.updateTodo(id, { completed: updatedCompleted });
        await loadStats();
      }
      
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, completed: updatedCompleted } : todo
      ));
    } catch (error) {
      setError('Failed to update todo');
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError('');
      
      if (isOnline) {
        await TodoAPI.deleteTodo(id);
        await loadStats();
      }
      
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async () => {
    if (editText.trim()) {
      try {
        setError('');
        
        if (isOnline) {
          await TodoAPI.updateTodo(editingId, { text: editText });
        }
        
        setTodos(todos.map(todo =>
          todo._id === editingId ? { ...todo, text: editText } : todo
        ));
      } catch (error) {
        setError('Failed to update todo');
        console.error('Error updating todo:', error);
      }
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
            📝 My To-Do App
          </h1>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center text-green-600">
                <Wifi size={20} />
                <span className="text-sm">Online</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <WifiOff size={20} />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            Loading...
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-blue-600">Total Tasks</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-green-600">Completed</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-yellow-600">Pending</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue || 0}</div>
            <div className="text-red-600">Overdue</div>
          </div>
        </div>
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter a new task..."
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addTodo}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        
        <div className="mb-6 flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl">No tasks found</p>
              <p>Add a new task to get started!</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo._id}
                className={`p-4 border-l-4 rounded-lg transition-all duration-200 ${
                  getPriorityColor(todo.priority)
                } ${todo.completed ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleTodo(todo._id)}
                      className={`p-2 rounded-full transition-colors ${
                        todo.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                    
                    <div className="flex-1">
                      {editingId === todo._id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          />
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {todo.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(todo.priority)}`}>
                              {todo.priority.toUpperCase()}
                            </span>
                            {todo.dueDate && (
                              <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                                isOverdue(todo.dueDate) ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                <Calendar size={12} />
                                {todo.dueDate}
                                {isOverdue(todo.dueDate) && ' (Overdue)'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingId !== todo._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(todo._id, todo.text)}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500">
          <p>💡 This app stores data locally during the session. To connect to MongoDB, you'll need to set up a backend server.</p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;