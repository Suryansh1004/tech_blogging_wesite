import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex space-x-4">
      <Link className="hover:text-yellow-300 font-semibold" to="/">Home</Link>
      <Link className="hover:text-yellow-300 font-semibold" to="/post">Post Blog</Link>
      <Link className="hover:text-yellow-300 font-semibold" to="/compiler">Compiler</Link>
    </nav>
    
  );
}
