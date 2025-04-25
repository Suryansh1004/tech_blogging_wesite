import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Compiler from './pages/Compiler';
import PostBlog from './pages/PostBlog';
import BlogDetail from './pages/BlogDetail';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="flex bg-gray-900 text-white min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="/post" element={<PostBlog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
