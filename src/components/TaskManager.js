import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const TaskForm = () => {
  const [name, setName] = useState('');
  const [completed, setCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');

  const handleUnauthorized = useCallback(() =>{
    localStorage.removeItem('userToken');
    navigate('/login');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Check if name and description are not empty
    if (!name.trim() || !description.trim()) {
      alert('Name and description are required and cannot be empty!');
      return;
    }

    try {
      const response = await axios.post('https://express-app-pied.vercel.app/api/tasks/create', {
        name,
        description,
        completed,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      alert(response.message);
      setName('');
      setCompleted(false);
      setDescription('');

      await fetchTasks();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Error creating task:', error);
      }
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://express-app-pied.vercel.app/api/tasks/getAllTasks', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      setTasks(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userToken, handleUnauthorized]); // Include handleUnauthorized as a dependency

  useEffect(() => {
    if (userToken) {
      fetchTasks();
    }
  }, [userToken, fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`https://express-app-pied.vercel.app/api/tasks/deleteTask/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      if (response.status === 200) {
        alert('Task deleted successfully');
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleTaskCompletion = async (taskID, isChecked) => {
    try {
      const response = await axios.patch(`https://express-app-pied.vercel.app/api/tasks/updateTask/${taskID}`, {
        completed: isChecked,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const updatedTask = response.data;
      setTasks(tasks.map(task => task._id === taskID ? updatedTask : task));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Error updating task completion:', error);
      }
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
        <button
          className="logout-button bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="task-form-content">
        <form onSubmit={handleSubmit} className="task-form flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <label className="form-label flex-1">
              <span className="text-gray-700">Name:</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-2 transition duration-150 ease-in-out"
              />
            </label>
            <label className="form-label flex-1">
              <span className="text-gray-700">Description:</span>
              <textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-2 transition duration-150 ease-in-out"
              />
            </label>
          </div>
          <button
            type="submit"
            className="submit-button w-full py-2 rounded-md bg-blue-500 text-white transition duration-150 ease-in-out hover:bg-blue-600"
          >
            Create Task
          </button>
        </form>
        {loading ? (
          <div className="loading-screen flex justify-center items-center h-64">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          tasks.length > 0 && (
            <div className="existing-tasks">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Existing Tasks:</h2>
              <ul className="task-list flex flex-col gap-4">
                {tasks.map((task) => (
                  <li key={task._id} className="task-item p-4 rounded-lg shadow flex flex-col gap-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                      <p className="text-gray-600 task-description">{task.description}</p>
                      <small className="text-gray-400">
                        Created: {new Date(task.createdAt).toLocaleString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric', 
                          hour: 'numeric', 
                          minute: 'numeric', 
                          hour12: true 
                        })}
                      </small>
                      <br />
                      <small className="text-gray-400">
                        Updated: {new Date(task.updatedAt).toLocaleString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric', 
                          hour: 'numeric', 
                          minute: 'numeric', 
                          hour12: true 
                        })}
                      </small>
                    </div>
                    <label className="form-label flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`completed-${task._id}`}
                        checked={task.completed}
                        onChange={(e) => handleTaskCompletion(task._id, e.target.checked)}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="text-gray-700">{task.completed ? "Completed" : "Not Completed"}</span>
                    </label>
                    <div className="task-actions flex gap-2 mt-2">
                      <button
                        className="edit-button bg-yellow-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleEditTask(task._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TaskForm;
