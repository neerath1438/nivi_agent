# 🤖 AI Workflow Builder

A complete, production-ready full-stack Property Management AI Website with visual drag-and-drop workflow builder.

## 🌟 Features

- **Visual Flow Builder**: Drag-and-drop interface similar to LangFlow/Flowise
- **5 Node Types**: Chat Input, Prompt Template, LLM (OpenAI), Elasticsearch, Chat Output
- **Real-time Execution**: Test flows instantly with live output
- **Persistent Storage**: PostgreSQL database for flows and run history
- **Beautiful UI**: Modern dark theme with glassmorphism and animations
- **Secure**: API keys never exposed to frontend
- **Production-Ready**: Modular, clean, and extensible codebase

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (Port 5173)      │
│  ┌────────────┐      ┌───────────────┐ │
│  │ Flow Canvas│ ───▶ │ Node Palette  │ │
│  │ React Flow │      │ 5 Node Types  │ │
│  └────────────┘      └───────────────┘ │
└──────────────┬──────────────────────────┘
               │ REST API
┌──────────────▼──────────────────────────┐
│      FastAPI Backend (Port 8000)        │
│  ┌─────────────┐    ┌────────────────┐ │
│  │Flow Executor│───▶│ OpenAI Service │ │
│  └─────────────┘    └────────────────┘ │
│         │                    │          │
│         ▼                    ▼          │
│  ┌─────────────┐    ┌────────────────┐ │
│  │ PostgreSQL  │    │ Elasticsearch  │ │
│  │  (Flows)    │    │   (Search)     │ │
│  └─────────────┘    └────────────────┘ │
└─────────────────────────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Python 3.9+ installed
- ✅ Node.js 16+ and npm installed
- ✅ PostgreSQL running (localhost:5432)
- ✅ Elasticsearch running (localhost:9200) - optional

## 🚀 Quick Start

### 1. Setup Backend

```bash
# Navigate to backend directory
cd ai-workflow-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env
# Note: .env already contains your API key

# Create database
psql -U postgres
CREATE DATABASE ai_workflow;
\q

# Run backend server
uvicorn app.main:app --reload --port 8000
```

Backend will start at: **http://localhost:8000**

### 2. Setup Frontend

```bash
# Open new terminal
cd ai-workflow-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start at: **http://localhost:5173**

### 3. Open in Browser

Navigate to **http://localhost:5173** and start building workflows!

## 🎯 How to Use

### Building Your First Flow

1. **Drag nodes** from the left sidebar to the canvas
2. **Connect nodes** in this order:
   - Chat Input → Prompt Template → LLM → Elasticsearch → Chat Output
3. **Configure Prompt Template**: 
   - Click the node
   - Edit the template (use `{input}` for variables)
4. **Test the flow**:
   - Enter a message in the test input box
   - Click "▶️ Run Flow"
   - View results in the output panel

### Example Flow

```
💬 Chat Input
    ↓
📝 Prompt Template: "Find properties matching: {input}"
    ↓
🤖 LLM (GPT-4o-mini): Process the query
    ↓
🔍 Elasticsearch: Search properties index
    ↓
✅ Chat Output: Display results
```

## 📁 Project Structure

```
ai-workflow-backend/
├── app/
│   ├── models/          # PostgreSQL models
│   ├── services/        # LLM, Elasticsearch, Flow Executor
│   ├── runners/         # Node runner implementations
│   ├── api/             # FastAPI routes
│   ├── config.py        # Environment configuration
│   └── main.py          # Application entry
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables

ai-workflow-frontend/
├── src/
│   ├── components/
│   │   ├── FlowBuilder/ # Canvas, Sidebar, Controls
│   │   └── Nodes/       # 5 node components
│   ├── services/        # API client
│   ├── App.jsx          # Main component
│   └── index.css        # Styles
├── package.json         # Node dependencies
└── vite.config.js       # Vite configuration
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/flow/save` | Save a flow to database |
| POST | `/api/flow/run` | Execute a flow with input |
| GET | `/api/flows` | List all saved flows |
| GET | `/api/flow/{id}` | Get specific flow |
| GET | `/api/flow/{id}/runs` | Get flow run history |
| GET | `/api/health` | Health check |

Full API documentation: **http://localhost:8000/docs**

## 🎨 Node Types

| Icon | Node | Purpose | Configuration |
|------|------|---------|---------------|
| 💬 | Chat Input | Receives user input | None |
| 📝 | Prompt Template | Format prompts with variables | Template text |
| 🤖 | LLM | OpenAI GPT models | Model, temperature, max tokens |
| 🔍 | Elasticsearch | Search property data | Index name, result count |
| ✅ | Chat Output | Display final result | None |

## 🔒 Security

- ✅ OpenAI API key stored in backend `.env` file only
- ✅ API key NEVER exposed to frontend
- ✅ CORS configured for localhost only
- ✅ `.gitignore` prevents committing sensitive files

## 🛠️ Configuration

### Backend (.env)

```env
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_workflow
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX=properties
CORS_ORIGINS=http://localhost:5173
```

### Frontend (vite.config.js)

```js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

## 🧪 Testing the System

1. **Test Backend API**:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Test Frontend**:
   - Open http://localhost:5173
   - You should see the flow builder interface

3. **Test Flow Execution**:
   - Create a simple flow with all 5 nodes
   - Enter test input: "Show me properties in London"
   - Click "Run Flow"
   - Check output panel for results

## 🚢 Production Deployment

### Backend
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with production settings
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
# Build production bundle
npm run build

# Serve with nginx or similar
```

## 📝 Database Schema

### Flows Table
- `id`: Primary key
- `name`: Flow name
- `description`: Optional description
- `flow_data`: JSON (nodes and edges)
- `created_at`, `updated_at`: Timestamps

### Flow Runs Table
- `id`: Primary key
- `flow_id`: Foreign key to flows
- `input_message`: User input
- `output_result`: Final output
- `execution_logs`: JSON array of logs
- `status`: pending/running/success/failed
- `error_message`: Error if failed
- `created_at`, `completed_at`: Timestamps

## 🤝 Contributing

This is a complete, production-ready codebase designed for:
- Property management AI workflows
- Extensible node-based systems
- Educational purposes
- Starting point for enterprise projects

## 📄 License

MIT License - feel free to use in your projects!

## 🆘 Troubleshooting

### Backend Issues

**Database connection error:**
```bash
# Ensure PostgreSQL is running
# Create database: CREATE DATABASE ai_workflow;
```

**Import errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API calls failing:**
```bash
# Ensure backend is running on port 8000
# Check CORS settings in .env
```

### Elasticsearch Issues

**ES not available:**
- The system gracefully handles ES being offline
- Search will return empty results but won't crash

## 🎓 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Flow Documentation](https://reactflow.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Elasticsearch Documentation](https://www.elastic.co/guide/)

---

**Built with ❤️ for Property Management AI**
