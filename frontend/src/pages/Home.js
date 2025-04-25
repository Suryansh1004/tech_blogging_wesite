// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://ironfist.pythonanywhere.com/api/blogs')
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
      });
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='p-4 bg-gray-900 min-h-screen flex'>
      <div className='flex-1'>
        <h2 className='text-3xl font-bold text-blue-500 mb-4'>Blog List</h2>
        <input
          className="p-2 border border-gray-600 bg-gray-800 text-white rounded mb-4 w-full"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className='bg-gray-800 p-4 rounded shadow mb-4'>
            <Link to={`/blog/${blog.id}`}>
              <h3 className='text-xl font-semibold text-gray-100 hover:text-blue-400'>{blog.title}</h3>
              <p className="text-sm text-gray-400">Posted on: {new Date(blog.date).toLocaleDateString()}</p>
            </Link>
          </div>
        ))}
      </div>
      <div className='w-1/3 ml-4'>
        <div className='bg-gray-700 p-4 rounded mb-4'>
          <h4 className='font-bold text-lg text-orange-500'>Learn Language Crash Course</h4>
          <ul className='list-disc ml-5 mt-2 text-sm text-gray-300'>
            <li>
              <Link to="/python-basics" className="text-blue-400 hover:text-yellow-300 font-semibold">
                Python Basics
              </Link>
            </li>
            <li>
              <Link to="/react-beginners" className="text-blue-400 hover:text-yellow-300 font-semibold">
                React for Beginners
              </Link>
            </li>
            <li>
              <Link to="/java-essentials" className="text-blue-400 hover:text-yellow-300 font-semibold">
                Java Essentials
              </Link>
            </li>
          </ul>
        </div>
        <div className='bg-gray-600 p-4 rounded text-center'>
          <p className="text-gray-300">Advertisement Space</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
