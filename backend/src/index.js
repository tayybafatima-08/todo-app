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
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

// CREATE
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    const todo = await prisma.todo.create({
      data: { title },
    });
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// READ ALL
app.get('/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// READ ONE
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// UPDATE
app.patch('/todos/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.update({
      where: { id: Number(req.params.id) },
      data: req.body, // e.g. { completed: true } or { title: "new title" }
    });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Todo not found' });
  }
});

// DELETE
app.delete('/todos/:id', async (req, res) => {
  try {
    await prisma.todo.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Todo not found' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});