import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const categories = {
  Python: ['Basics', 'OOP', 'Web Scraping', 'Flask', 'Data Science'],
  JavaScript: ['ES6+', 'DOM', 'React', 'Async/Await', 'Node.js'],
  Java: ['Syntax', 'Collections', 'Spring Boot', 'OOP', 'JVM'],
  'C++': ['Pointers', 'STL', 'OOP', 'Memory Mgmt', 'Templates'],
  AWS: ['S3', 'Load Balancers', 'EC2', 'ECR', 'IAM'],
  Go: ['Concurrency', 'Web APIs', 'Modules', 'Structs', 'Interfaces'],
  Go: ['Concurrency', 'Web APIs', 'Modules', 'Structs', 'Interfaces'],
  Go: ['Concurrency', 'Web APIs', 'Modules', 'Structs', 'Interfaces'],
};

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (lang) => {
    setActiveTab(activeTab === lang ? null : lang);
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col space-y-4 min-h-screen">
      <Link className="text-2xl font-extrabold text-orange-400 mb-4" to="/">EduTech</Link>

      <nav className="space-y-2">
        {/* <Link to="/" className="block hover:text-orange-500 font-medium">🏠 Home</Link> */}
        <Link to="/compiler" className="block hover:text-orange-500 font-medium">💻 Compiler</Link>
      </nav>

      <div className="mt-6">
        <h2 className="text-lg font-semibold border-b border-gray-600 pb-1 mb-2 text-orange-300">📚 Categories</h2>

        <ul className="space-y-2">
          {Object.entries(categories).map(([language, topics]) => (
            <li key={language} className="rounded bg-gray-800">
              <button
                onClick={() => toggleTab(language)}
                className={`w-full text-left px-3 py-2 font-semibold flex justify-between items-center rounded hover:bg-gray-700 transition`}
              >
                {language}
                <span className="text-sm">{activeTab === language ? '▲' : '▼'}</span>
              </button>

              <AnimatePresence>
                {activeTab === language && (
                  <motion.ul
                    key="topics"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 pr-2 py-2 text-sm space-y-1 bg-gray-700 rounded-b"
                  >
                    {topics.map((topic) => (
                      <li key={topic}>
                        <Link
                          to={`/topics/${language.toLowerCase()}/${topic.toLowerCase().replace(/ /g, '-')}`}
                          className="block text-gray-300 hover:text-orange-400"
                        >
                          • {topic}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-blue-900 text-center rounded-t shadow">
        <p className="text-sm">Join our programming community</p>
        <button className="bg-orange-500 px-3 py-1 mt-2 text-sm rounded hover:bg-orange-400 transition">
          🚀 Join Now
        </button>
      </div>
    </div>
  );
}
