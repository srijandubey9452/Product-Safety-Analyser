Product Analyser - MERN Stack Application
Overview
Product Analyser is a comprehensive solution that allows users to upload images of product labels (cosmetics, food, or personal care), extract the ingredient information using AWS Rekognition's OCR capabilities, and display the safety grades of ingredients through interactive visualizations. A real-time chatbot also provides instant answers and problem-solving related to the product.

Features
Image Upload: Users can upload product labels for automatic ingredient extraction.

OCR Extraction: Uses AWS Rekognition to extract text from product images.

Safety Grading: Ingredients are matched with a grading list stored in a MongoDB database, and a safety grade is assigned based on a 3-tier grading system.

Visual Feedback: Circular and bar graphs are generated to show the ingredient safety grades and overall product safety.

Real-Time Chatbot: A chatbot powered by AWS Lambda and AWS Bedrock answers queries related to the product and helps users resolve issues.

Technologies Used
Frontend:

React.js

Chart.js for data visualization (circular & bar graphs)

Axios for API requests

Backend:

Node.js & Express.js

MongoDB for storing product data and ingredient grading information

AWS Services:

S3 for storing uploaded images

Rekognition for OCR text extraction

Lambda and AWS Bedrock for the chatbot functionality

Installation & Setup
Prerequisites
Node.js (v16 or above)

MongoDB instance (local or cloud)

AWS account with permissions for S3, Rekognition, Lambda, and Bedrock

1. Clone the Repository
bash
Copy
Edit
https://github.com/srijandubey9452/Product-Safety-Analyser.git
cd Product-Safety-Analyer
2. Install Dependencies
For the frontend:

bash
Copy
Edit
cd client
npm install
For the backend:

bash
Copy
Edit
cd server
npm install
3. Set up AWS Credentials
Ensure your AWS credentials are set up correctly:

bash
Copy
Edit
aws configure
Make sure you have access to S3, Rekognition, Lambda, and Bedrock.

4. Start the Application
To start both the backend and frontend:

bash
Copy
Edit
cd server
npm start  # For the backend

cd client
npm start  # For the frontend
5. Upload an Image
Once the application is running, go to the frontend, select a product category (cosmetics, food, personal care), and upload an image of a product label. The image will be processed, and the safety grading of ingredients will be displayed, along with the interactive graphs.

6. Chatbot
Use the chatbot feature to ask real-time questions regarding the product and receive helpful answers or solutions.

Usage
Upload images to evaluate the ingredient safety.

View safety grades and visualize data with graphs.

Use the chatbot to answer product-related questions.

Future Improvements
Add a more comprehensive database of products and their ingredients.

Improve the chatbot's intelligence with more context-based answers.

Enhance the ingredient grading system with more factors.

License
This project is licensed under the MIT License - see the LICENSE file for details.
