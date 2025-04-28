import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskListPage = () => {
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [count] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskData, setEditTaskData] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchTasks();
    }, [page]);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:3005/api/task/tasks?page=${page}&count=${count}`);
            setTasks(res.data?.tasks || []);
            setTotalPages(res.data?.totalPages || 1);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (!newTask.title.trim()) {
            alert('Title is required');
            return;
        }
        try {
            await axios.post('http://localhost:3005/api/task/tasks', newTask);
            setNewTask({ title: '', description: '' });
            fetchTasks();
        } catch (err) {
            console.error('Error adding task:', err);
            setError('Failed to add task.');
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`http://localhost:3005/api/task/tasks/${id}`);
                fetchTasks();
            } catch (err) {
                console.error('Error deleting task:', err);
                setError('Failed to delete task.');
            }
        }
    };

    const handleEditTask = (task) => {
        setEditTaskId(task.id);
        setEditTaskData({ title: task.title, description: task.description });
    };

    const handleUpdateTask = async () => {
        if (!editTaskData.title.trim()) {
            alert('Title is required');
            return;
        }
        try {
            await axios.put(`http://localhost:3005/api/task/tasks/${editTaskId}`, editTaskData);
            setEditTaskId(null);
            setEditTaskData({ title: '', description: '' });
            fetchTasks();
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task.');
        }
    };

    const handleStatusToggle = async (task) => {
        // Toggle the status between "Completed" and "Pending"
        const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

        try {
            // Send a PATCH request to update the status on the backend
            await axios.patch(`http://localhost:3005/api/task/tasks/${task.id}`, { status: updatedStatus });

            // Refresh the task list after updating the status
            fetchTasks();
        } catch (err) {
            console.error('Error updating task status:', err);
            setError('Failed to update task status.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Task List</h2>

            {/* Add or Edit Task Form */}
            <div className="mb-4">
                <h4>{editTaskId ? 'Edit Task' : 'Add New Task'}</h4>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={editTaskId ? editTaskData.title : newTask.title}
                    onChange={(e) =>
                        editTaskId
                            ? setEditTaskData({ ...editTaskData, title: e.target.value })
                            : setNewTask({ ...newTask, title: e.target.value })
                    }
                />
                <textarea
                    className="form-control mb-2"
                    placeholder="Description"
                    value={editTaskId ? editTaskData.description : newTask.description}
                    onChange={(e) =>
                        editTaskId
                            ? setEditTaskData({ ...editTaskData, description: e.target.value })
                            : setNewTask({ ...newTask, description: e.target.value })
                    }
                />
                {editTaskId ? (
                    <div>
                        <button className="btn btn-success me-2" onClick={handleUpdateTask}>
                            Update Task
                        </button>
                        <button className="btn btn-secondary" onClick={() => setEditTaskId(null)}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={handleAddTask}>
                        Add Task
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Loading Spinner */}
            {loading ? (
                <div className="text-center">Loading tasks...</div>
            ) : (
                <>
                    {/* Tasks Table */}
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${task.status === 'Completed' ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => handleStatusToggle(task)}
                                            >
                                                {task.status || 'Pending'}
                                            </button>
                                        </td>
                                        <td>{task.created_at ? new Date(task.created_at).toLocaleString() : 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-info me-2"
                                                onClick={() => handleEditTask(task)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No Tasks Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-secondary"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-secondary"
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskListPage;
