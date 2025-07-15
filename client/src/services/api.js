const API_BASE_URL = 'http://localhost:5000/api';

class TodoAPI {
  async getAllTodos(filter = 'all', priority = 'all') {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (priority !== 'all') params.append('priority', priority);
    
    const url = `${API_BASE_URL}/todos${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    
    return response.json();
  }

  async createTodo(todoData) {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create todo');
    }

    return response.json();
  }

  async updateTodo(id, updateData) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update todo');
    }

    return response.json();
  }

  async deleteTodo(id) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete todo');
    }

    return response.json();
  }

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/todos/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return response.json();
  }

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export default new TodoAPI();
