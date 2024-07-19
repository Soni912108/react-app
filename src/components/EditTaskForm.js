import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTaskForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');
  const [task, setTask] = useState({
    name: '',
    description: '',
    completed: false, // Added completed field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_APP_API_URL}/api/tasks/getOneTask/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        setTask(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [taskId, userToken]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_APP_API_URL}/api/tasks/updateTask/${taskId}`, task, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error); // Display error message to the user
    }
  };

  const handleCancel = () => {
    navigate('/tasks'); // Navigate to the tasks page or another page as needed
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="edit-task-form-container max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-2">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task Name"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700 mb-2">
            Description:
          </label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task Description"
            rows="4"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
            className="h-5 w-5 text-blue-500 border-gray-300 rounded"
          />
          <label className="text-lg font-medium text-gray-700">
            Mark as Completed
          </label>
        </div>
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
