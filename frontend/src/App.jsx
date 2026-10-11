import { useEffect, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  toggleTodo,
  updateTodo
} from './api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError('Unable to load todos. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Please enter a valid task title.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const newTodo = await createTodo(title);
      setTodos((currentTodos) => [newTodo, ...currentTodos]);
      setTitle('');
    } catch (err) {
      setError('Failed to add the todo.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const updatedTodo = await toggleTodo(id);
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      setError('Failed to update the todo status.');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete the todo.');
      console.error(err);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setError('');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
    setEditTitle('');
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingTodo) {
      return;
    }

    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      setError('Todo title cannot be empty.');
      return;
    }

    try {
      const updatedTodo = await updateTodo(editingTodo.id, { title: trimmedTitle });
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingTodo.id ? updatedTodo : todo
        )
      );
      closeEditModal();
    } catch (err) {
      setError('Failed to update the todo title.');
      console.error(err);
    }
  };

  return (
    <div className="app-shell">
      <div className="todo-card">
        <header className="todo-header">
          <div>
            <p className="eyebrow">Daily Planner</p>
            <h1>Todo List</h1>
          </div>
          <button className="refresh-button" onClick={loadTodos} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </header>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a new task"
            aria-label="Add a new task"
          />
          <button type="submit" disabled={submitting || !title.trim()}>
            {submitting ? 'Saving...' : 'Add Todo'}
          </button>
        </form>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="status-box">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="status-box">No todos yet. Add your first task!</div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button
                  className="toggle-button"
                  onClick={() => handleToggleTodo(todo.id)}
                  aria-label={`Toggle ${todo.title}`}
                >
                  {todo.completed ? '✓' : '○'}
                </button>

                <div className="todo-content">
                  <span className="todo-title">{todo.title}</span>
                  <small>
                    {new Date(todo.created_at).toLocaleString()}
                  </small>
                </div>

                <div className="action-group">
                  <button
                    className="secondary-button"
                    onClick={() => openEditModal(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditModalOpen && editingTodo && (
        <div className="modal-backdrop" onClick={closeEditModal}>
          <div className="edit-modal" onClick={(event) => event.stopPropagation()}>
            <h2>Edit Todo</h2>
            <form onSubmit={handleSaveEdit}>
              <label htmlFor="edit-todo-title">Task name</label>
              <input
                id="edit-todo-title"
                className="modal-input"
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                autoFocus
              />

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
