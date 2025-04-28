const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let dbPath = '';
dbPath = path.join(__dirname, '../accounting.db');
console.log('Database Path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database opening error:', err.message);
  } else {
    console.log('Database opened successfully');
  }
});


// GET tasks with pagination
router.get('/tasks', (req, res) => {
  const { page = 1, count = 10 } = req.query;
  const offset = (page - 1) * count;

  db.all("SELECT * FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?", [count, offset], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    db.get("SELECT COUNT(*) AS total FROM tasks", [], (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        tasks: rows
      });
    });
  });
});

// POST new task
router.post('/tasks', (req, res) => {
  const { title, description, status = 'pending' } = req.body;
  console.log(req.body)
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const query = `
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `;

  db.run(query, [title, description, status], function (err) {
    if (err) {
      console.error('Error inserting task:', err.message);
      return res.status(500).send(err.message);
    }
    res.json({ message: 'Task created successfully', taskId: this.lastID });
  });
});

// PATCH task status
router.patch('/tasks/:id', (req, res) => {
  console.log(req.body)
  const { id } = req.params;
  const { status } = req.body; // Get the new status from the request body

  // Validate the status
  if (!status || (status !== 'Pending' && status !== 'Completed')) {
    return res.status(400).json({ message: 'Invalid status. Status should be "Pending" or "Completed".' });
  }

  // Update the task's status in the database
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.run(query, [status, id], function (err) {
    if (err) {
      console.error('Error updating task status:', err.message);
      return res.status(500).json({ message: 'Failed to update task status.' });
    }

    // Check if any rows were affected (task found and updated)
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task status updated successfully' });
  });
});


// PUT edit task (update)
router.put('/tasks/:id', (req, res) => {
  const { title, description, status } = req.body;
  const taskId = req.params.id;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const query = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?
    WHERE id = ?
  `;

  db.run(query, [title, description, status, taskId], function (err) {
    if (err) {
      console.error('Error updating task:', err.message);
      return res.status(500).send(err.message);
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully' });
  });
});

// DELETE task
router.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const query = `
    DELETE FROM tasks WHERE id = ?
  `;

  db.run(query, [taskId], function (err) {
    if (err) {
      console.error('Error deleting task:', err.message);
      return res.status(500).send(err.message);
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;
