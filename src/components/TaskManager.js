import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const TaskForm = () => {
  const [name, setName] = useState('');
  const [completed, setCompleted] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/tasks', {
        name,
        description,
        completed,
      });

      console.log('Task created successfully:', response.data);
      setName('');
      setCompleted(0);
      setDescription('');

      const fetchedTasks = await axios.get('/api/tasks');
      setTasks(fetchedTasks.data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  async function deleteTask(taskId) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error deleting task: ${response.statusText}`);
      }
  
      const data = await response.json();
      alert(data)
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  const handleTaskCompletion = async (taskID, isChecked) => {
    try {
      // Update task data on the server
      const response = await fetch(`/api/tasks/${taskID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isChecked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task completion');
      }
  
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === taskID ? updatedTask : task)); // Update local state
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };
  

  const handleEditTask = (taskId) => {
    navigate(`/tasks/${taskId}/edit`); // Redirect to edit route with taskId
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    };

    fetchTasks();
  }, []);

  return (
    <div className="task-form-container flex flex-col gap-4">
      <button className="logout-button self-end" onClick={handleLogout}>
        Logout
      </button>
      <form onSubmit={handleSubmit} className="task-form flex flex-col gap-2">
        <label className="form-label flex items-center gap-2">
          <span>Name:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-1"
          />
        </label>
        <label className="form-label flex items-center gap-2">
          <span>Description:</span>
          <input
            type="text-area" placeholder="add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-1"
          />
        </label>

        <button type="submit" className="submit-button w-full py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create Task
        </button>
      </form>
      {tasks.length > 0 && (
        <div className="existing-tasks flex flex-col gap-2">
          <h2>Existing Tasks:</h2>
          <ul className="task-list flex flex-col gap-2">
            {tasks.map((task) => (
              <li key={task._id} className="task-item flex items-center justify-between">
                {task.name}<br />
                {task.description}<br />
                {task.createdAt}<br />
                {task.updatedAt}<br />
                {/* Display completed status and checkbox */}
                <label className="form-label flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`completed-${task._id}`} // Unique ID for each task
                    checked={task.completed} // Checked based on task data
                    onChange={(e) => handleTaskCompletion(task._id, e.target.checked)}
                  />
                  <span>{task.completed ? "Completed" : "Not Completed"}</span>
                </label>
                <div className="task-actions flex gap-2">
                  <button
                    className="edit-button bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => handleEditTask(task._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
};

export default TaskForm;

