import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../editTask.css';

const EditTaskForm = () => {
  const { taskId } = useParams(); // Get task ID from URL parameter
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://express-app-pied.vercel.app/api/tasks/${taskId}`);
        if (!response.ok) {
          throw new Error(`Error fetching task: ${response.statusText}`);
        }
        const data = await response.json();
        setTask(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const handleChange = (event) => {
    // Update task state with changes from form fields
    const updatedTask = { ...task }; // Create a copy to avoid mutation
    updatedTask[event.target.name] = event.target.value;
    setTask(updatedTask);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`https://express-app-pied.vercel.app/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`Error updating task: ${response.statusText}`);
      }

      // Handle successful update
      navigate('/tasks'); 
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error); // Display error message to the user
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!task) {
    return <p>Task not found.</p>;
  }

  return (
    <div className="edit-task-form-container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit} className='edit-task-form flex flex-col gap-4'>
        <label className="form-label flex flex-col gap-1">
          <span className="text-gray-700">Name:</span>
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-2"
          />
        </label>
        <label className="form-label flex flex-col gap-1">
          <span className="text-gray-700">Description:</span>
          <textarea
            name="description"
            value={task.description || ''}
            onChange={handleChange}
            className="form-input w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          className="submit-button w-full py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTaskForm;
