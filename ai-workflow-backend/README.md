# AI Workflow Builder - Backend

Production-ready FastAPI backend for the AI workflow builder with OpenAI LLM integration, Elasticsearch, and PostgreSQL.

## Features

- 🚀 FastAPI REST API
- 🤖 OpenAI GPT integration
- 🔍 Elasticsearch support
- 💾 PostgreSQL database
- 🔄 Node-based flow execution engine
- 📊 Flow run history tracking

## Prerequisites

- Python 3.9+
- PostgreSQL
- Elasticsearch (optional, gracefully handles if offline)

## Installation

1. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
copy .env.example .env
# Edit .env with your settings
```

4. **Create PostgreSQL database:**
```sql
CREATE DATABASE ai_workflow;
```

5. **Run the application:**
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

- `POST /api/flow/save` - Save a flow
- `POST /api/flow/run` - Execute a flow
- `GET /api/flows` - List all flows
- `GET /api/flow/{id}` - Get specific flow
- `GET /api/flow/{id}/runs` - Get flow execution history
- `GET /api/health` - Health check

## Documentation

Once running, visit:
- API Docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

## Environment Variables

See `.env.example` for all configuration options:
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `DATABASE_URL` - PostgreSQL connection string
- `ELASTICSEARCH_URL` - Elasticsearch endpoint
- `CORS_ORIGINS` - Allowed CORS origins

## Project Structure

```
app/
├── models/          # SQLAlchemy models
├── services/        # Business logic (LLM, ES, Flow Executor)
├── runners/         # Node runner implementations
├── api/             # FastAPI routes
├── config.py        # Configuration
└── main.py          # Application entry point
```

## License

MIT
