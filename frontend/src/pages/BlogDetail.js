import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate(); // Updated from useHistory

  useEffect(() => {
    axios.get(`https://ironfist.pythonanywhere.com/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.error('Error fetching blog:', err);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://ironfist.pythonanywhere.com/api/blogs/${id}`);
      alert('Blog deleted successfully');
      navigate('/'); // Updated from history.push('/')
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-500 mb-4">{blog.title}</h2>
      <p className="text-sm text-gray-400">Posted on: {new Date(blog.date).toLocaleDateString()}</p>
      <div
        className="mt-4 text-gray-300"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Blog
        </button>
      </div>
    </div>
  );
}
