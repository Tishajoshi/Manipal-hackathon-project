POLICYPRO🤖

An AI-powered chatbot that simplifies healthcare insurance policies. Upload your policy PDF, ask questions in plain English, and get instant, accurate answers about your coverage, claim amounts, and exclusions.

🚀 Features

📄 PDF Intelligence: Upload and process complex insurance policy documents.
💬 Natural Language Queries: Ask questions like "Is knee surgery covered?" or "What is the claim amount for hospitalization?"
✅ Structured Answers: Receive clear responses with:

Coverage Status: Yes or No.
Financial Details: Claim amount, co-pay, or deductible information.
Explanation & Source: A clear explanation highlighting the relevant section from your policy document.

🔒 Transparency: Every answer is backed by direct quotes from your policy for full transparency and trust.

🛠️ Tech Stack

Frontend:
Streamlit - For building a rapid, interactive, and user-friendly web interface.

Backend:
FastAPI - A high-performance, modern Python web framework for building the API.
Uvicorn - ASGI server for running FastAPI.

AI & Data Processing:
OpenAI API - Powers the entire AI pipeline:
text-embedding-ada-002 - For generating vector embeddings from text.
gpt-3.5-turbo / gpt-4 - For generating intelligent, context-aware responses.
Pinecone - Vector database for efficient similarity search to find relevant policy text.
PyPDF2 / pdfplumber - For extracting text from uploaded PDF files.

Database (Optional):
MongoDB - For optionally storing user query history and interactions.

📋 Prerequisites

Before you begin, ensure you have met the following requirements:
Python 3.8+
A Pinecone account and API key (https://www.pinecone.io/)
An OpenAI API key (https://platform.openai.com/)

⚙️ Installation & Setup

Clone the repository:
git clone https://github.com/selena-arch/hackathon-project.git
cd hackathon-project

Create a virtual environment and activate it:
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

Install the dependencies:
pip install -r requirements.txt

Set up environment variables:
Create a .env file in the root directory and add your API keys:
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=your_pinecone_index_name_here
# Optional: MongoDB connection string
# MONGODB_URI=your_mongodb_connection_string_here

Run the application:
streamlit run app.py  # For the frontend
uvicorn main:app --reload  # For the backend API (if separate)
Open your browser and go to http://localhost:8501.

🧠 How It Works (Architecture)

POLICYPRO uses a RAG (Retrieval-Augmented Generation) architecture to ensure accurate and reliable answers.
Ingest: You upload a policy PDF. The system extracts and splits the text into manageable chunks.
Embed & Store: Each chunk is converted into a vector embedding using OpenAI's model and stored in Pinecone.
Retrieve: When you ask a question, it is also embedded. Pinecone performs a k-NN similarity search to find the most relevant text chunks from your policy.
Generate: These relevant chunks are sent to OpenAI's GPT model, which synthesizes them into a final, easy-to-understand answer grounded in your document.

📁 Project Structure

hackathon-project/
├── app.py                 # Main Streamlit frontend application
├── main.py               # FastAPI backend server (if applicable)
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (gitignored)
├── utils/
│   ├── pdf_processor.py  # Code for PDF text extraction and chunking
│   └── pinecone_utils.py # Functions for interacting with Pinecone
└── README.md

👥 Contributors

TISHA JOSHI (https://github.com/Tishajoshi)


KRUSHNA KAKDE (https://github.com/KrushnaKakde)

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments

Built for the [HACKVERSE-2025] in Manipal Institute Of Technology, Bengaluru.

Inspired by the need for transparency and simplicity in the healthcare insurance industry.
