import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'react-toastify';

export default function PostBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Avoid double submissions
    setLoading(true);

    try {
      // Upload image to Firebase Storage if image exists
      let uploadedImageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const imageResponse = await axios.post('https://ironfist.pythonanywhere.com/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrl = imageResponse.data.imageUrl; // Get image URL from response
      }

      const blogData = {
        title,
        content,
        imageUrl: uploadedImageUrl,
        date: new Date().toISOString(),
        author: 'John Doe', // Add dynamic author info here
      };

      // Post blog data to Flask API
      const response = await axios.post('https://ironfist.pythonanywhere.com/api/blogs', blogData);
      toast.success('Blog posted successfully!');
      setTitle('');
      setContent('');
      setImage(null);
      setImageUrl('');
    } catch (error) {
      toast.error('Error posting blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-800 shadow rounded">
      <h2 className="text-3xl font-bold text-blue-500 mb-4">Post Your Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded mb-4"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter blog title"
          required
        />

        <div className="mb-4">
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="text-white"
          />
          {imageUrl && (
            <div className="mt-4 relative inline-block">
              <img
                src={imageUrl}
                alt="Blog"
                className="w-48 h-32 object-cover rounded shadow"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImageUrl('');
                }}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
              >
                ✖ Remove
              </button>
            </div>
          )}

        </div>

        <ReactQuill
          value={content}
          onChange={handleContentChange}
          placeholder="Write your blog content here"
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              ['code-block'],
            ],
          }}
        />

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
