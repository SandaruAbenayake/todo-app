const pool = require('../config/db');

const getAllTodos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );

    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'Todo ID must be a valid number.' });
    }

    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Todo title is required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO todos (title, completed) VALUES (?, false)',
      [title.trim()]
    );

    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);

    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'Todo ID must be a valid number.' });
    }

    const [existingTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);

    if (existingTodo.length === 0) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    const updatedTitle = title !== undefined ? title.trim() : existingTodo[0].title;
    const updatedCompleted = completed !== undefined ? Boolean(completed) : existingTodo[0].completed;

    if (!updatedTitle) {
      return res.status(400).json({ message: 'Todo title cannot be empty.' });
    }

    await pool.query(
      'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
      [updatedTitle, updatedCompleted, id]
    );

    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);

    return res.status(200).json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'Todo ID must be a valid number.' });
    }

    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    return res.status(200).json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

const toggleTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'Todo ID must be a valid number.' });
    }

    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    const todo = rows[0];
    const newCompletedState = !Boolean(todo.completed);

    await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [newCompletedState, id]);

    const [updatedRows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);

    return res.status(200).json(updatedRows[0]);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
};
