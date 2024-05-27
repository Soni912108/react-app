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
    <div className="edit-task-form-container">
      <form onSubmit={handleSubmit} className='edit-task-form'>
        <label>
          Name:
          <input type="text" name="name" value={task.name} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={task.description || ''} onChange={handleChange} />
        </label>
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTaskForm;
