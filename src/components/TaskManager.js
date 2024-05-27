import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const TaskForm = () => {
  const [name, setName] = useState('');
  const [completed, setCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await axios.post('https://express-app-pied.vercel.app/api/tasks', {
          name,
          description,
          completed,
        });
    
        console.log('Task created successfully:', response.data);
        setName('');
        setCompleted(false);
        setDescription('');
    
        const fetchedTasks = await axios.get('https://express-app-pied.vercel.app/api/tasks');
        setTasks(fetchedTasks.data);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    };
    
    const deleteTask = async (taskId) => {
      try {
        const response = await axios.delete(`https://express-app-pied.vercel.app/api/tasks/${taskId}`);
        if (response.status === 200) {
          alert('Task deleted successfully');
          setTasks(tasks.filter(task => task._id !== taskId));
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };
    
    const handleTaskCompletion = async (taskID, isChecked) => {
      try {
        const response = await axios.patch(`https://express-app-pied.vercel.app/api/tasks/${taskID}`, {
          completed: isChecked,
        });
        const updatedTask = response.data;
        setTasks(tasks.map(task => task._id === taskID ? updatedTask : task));
      } catch (error) {
        console.error('Error updating task completion:', error);
      }
    };
    
    useEffect(() => {
      const fetchTasks = async () => {
        const response = await axios.get('https://express-app-pied.vercel.app/api/tasks');
        setTasks(response.data);
      };
    
      fetchTasks();
  }, []);


  return (
    <div className="task-form-container">
      <div className="task-form-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
        <button
          className="logout-button"
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
                className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-2"
              />
            </label>
            <label className="form-label flex-1">
              <span className="text-gray-700">Description:</span>
              <textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-2"
              />
            </label>
          </div>
          <button
            type="submit"
            className="submit-button w-full py-2 rounded-md"
          >
            Create Task
          </button>
        </form>
        {tasks.length > 0 && (
          <div className="existing-tasks">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Existing Tasks:</h2>
            <ul className="task-list flex flex-col gap-4">
              {tasks.map((task) => (
                <li key={task._id} className="task-item p-4 rounded-lg shadow flex flex-col gap-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                    <p className="text-gray-600">{task.description}</p>
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
                      className="edit-button"
                      onClick={() => handleEditTask(task._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
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
    </div>
  );
};

export default TaskForm;
