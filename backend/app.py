import datetime
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
# from flask import Flask, request, jsonify
# from firebase_config import db, upload_image_to_storage



cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
blogs_ref = db.collection("blogs")

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def welcome():
    return jsonify({'Message': 'Welcome to BitCodeMatrix blogs'})

# Handle image upload to Firebase Storage
# @app.route('/upload-image', methods=['POST'])
# def upload_image():
#     image = request.files.get('file')
#     if image:
#         image_url = upload_image_to_storage(image)
#         return jsonify({'imageUrl': image_url}), 200
#     else:
#         return jsonify({'error': 'No image provided'}), 400

# Create a new blog
@app.route('/api/blogs', methods=['POST'])
def create_blog():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('imageUrl', '')
    date = data.get('date')
    author = data.get('author')

    blog_ref = db.collection('blogs').add({
        'title': title,
        'content': content,
        'imageUrl': image_url,
        'date': date,
        'author': author,
    })
    
    # `blog_ref` is a tuple, so we need to get the document ID from the first element
    blog_id = blog_ref[1].id

    return jsonify({'message': 'Blog created successfully', 'id': blog_id}), 201



from datetime import datetime

# Get all blogs
@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    try:
        blogs_ref = db.collection('blogs')
        docs = blogs_ref.stream()

        blogs = []
        for doc in docs:
            blog_data = doc.to_dict()

            # Add document ID to the blog data
            blog_data['id'] = doc.id  # Add the document ID to the data
            # Check if 'date' field exists
            if 'date' in blog_data:
                # If 'date' is a string, convert it to datetime
                if isinstance(blog_data['date'], str):
                    try:
                        blog_data['date'] = datetime.fromisoformat(blog_data['date'])
                    except ValueError:
                        blog_data['date'] = 'Invalid date format'
                # Format the date
                blog_data['date'] = blog_data['date'].strftime('%Y-%m-%d %H:%M:%S')
            else:
                # If 'date' doesn't exist, set a default value
                blog_data['date'] = 'No date available'

            blogs.append(blog_data)

        return jsonify(blogs)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to retrieve blogs'}), 500




# Get a specific blog by ID
@app.route('/api/blogs/<blog_id>', methods=['GET'])
def get_blog(blog_id):
    blog_ref = db.collection('blogs').document(blog_id)
    blog = blog_ref.get()

    if blog.exists:
        blog_data = blog.to_dict()

        # Check if 'date' is a string or datetime object
        if isinstance(blog_data.get('date'), str):
            # If 'date' is a string, return it directly or you can try to convert it into a datetime object
            blog_data['date'] = blog_data['date']  # It is already a string, so no need to format
        elif isinstance(blog_data.get('date'), datetime):
            # If 'date' is a datetime object, format it
            blog_data['date'] = blog_data['date'].strftime('%Y-%m-%d %H:%M:%S')
        else:
            blog_data['date'] = 'No date available'  # If there's no date, you can set a default

        return jsonify({
            'id': blog.id,
            'title': blog.get('title'),
            'content': blog.get('content'),
            'date': blog_data['date']
        })
    else:
        return jsonify({'error': 'Blog not found'}), 404

# Delete a blog by ID
@app.route('/api/blogs/<blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    try:
        blog_ref = db.collection('blogs').document(blog_id)
        blog_ref.delete()
        return jsonify({'message': 'Blog deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting blog: {e}")
        return jsonify({'error': 'Failed to delete blog'}), 500


@app.route('/api/compile', methods=['POST'])
def compile_code():
    data = request.json
    clientId = '8fad4a1c1129246bd6f44d6951c35847'
    clientSecret = '71b36970e7d19e4c6be4cbed037befa7057d9dd1adc94f04da2ac261f064be24'
    payload = {
            "clientId": clientId,
            "clientSecret": clientSecret,
            "script": data['script'],
            "stdin": "",
            "language": data['language'],
            "versionIndex": "3",
            "compileOnly": False
        }

    try:
        response = requests.post("https://api.jdoodle.com/v1/execute", json=payload)
        result = response.json()
        return jsonify({"output": result.get("output", "No output received.")})
    except Exception as e:
        return jsonify({"output": f"Error: {str(e)}"})



if __name__ == '__main__':
    app.run(debug=True)
