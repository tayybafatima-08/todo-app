import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/todos`);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    fetchTodos();
  };

  const toggleTodo = async (id, completed) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    fetchTodos();
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <h1>My Todos</h1>

        <form className="add-form" onSubmit={addTodo}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
          />
          <button type="submit">Add</button>
        </form>

        {todos.length === 0 ? (
          <p className="empty">No todos yet. Add one above.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                  <span className="title">{todo.title}</span>
                </label>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete todo"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <p className="count">
            {remaining} {remaining === 1 ? 'item' : 'items'} left
          </p>
        )}
      </div>
    </div>
  );
}

export default App;