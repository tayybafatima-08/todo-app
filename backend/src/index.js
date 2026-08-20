const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

dotenv.config();

const app = express();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json()); // lets Express parse JSON request bodies (needed for POST/PATCH)

// Test route
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

const PORT = process.env.PORT || 5000;

app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }

    const todo = await prisma.todo.create({
      data: { title: title.trim() }
    });

    return res.status(201).json(todo);
  } catch (error) {
    console.error('POST /todos error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(todos);
  } catch (error) {
    console.error('GET /todos error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid todo id' });
    }

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    return res.json(todo);
  } catch (error) {
    console.error('GET /todos/:id error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/todos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid todo id' });
    }

    const data = {};

    if (typeof req.body.title !== 'undefined') {
      if (typeof req.body.title !== 'string' || !req.body.title.trim()) {
        return res.status(400).json({ error: 'title must be a non-empty string' });
      }
      data.title = req.body.title.trim();
    }

    if (typeof req.body.completed !== 'undefined') {
      if (typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ error: 'completed must be a boolean' });
      }
      data.completed = req.body.completed;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided' });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data
    });

    return res.json(updated);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    console.error('PATCH /todos/:id error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid todo id' });
    }

    await prisma.todo.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Todo not found' });
    }
    console.error('DELETE /todos/:id error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});