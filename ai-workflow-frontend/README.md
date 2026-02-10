# AI Workflow Builder - Frontend

Modern React frontend with drag-and-drop flow builder using React Flow.

## Features

- 🎨 Beautiful dark theme UI
- 🎯 Drag-and-drop node builder
- 🔗 Visual flow connections
- ▶️ Real-time flow execution
- 📊 Execution logs display
- 🎭 5 node types (Chat Input, Prompt, LLM, Elasticsearch, Output)

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:5173
```

## Usage

### Building a Flow

1. **Drag nodes** from the left sidebar onto the canvas
2. **Connect nodes** by dragging from output to input handles
3. **Configure nodes** by clicking on them
4. **Test flow** by entering a message and clicking "Run Flow"

### Node Types

- **💬 Chat Input** - Receives user input
- **📝 Prompt Template** - Format prompts with variables
- **🤖 LLM** - OpenAI GPT models
- **🔍 Elasticsearch** - Search properties
- **✅ Chat Output** - Final response

### Example Flow

```
Chat Input → Prompt Template → LLM → Elasticsearch → Chat Output
```

## Building for Production

```bash
npm run build
```

Built files will be in `dist/` directory.

## Configuration

The frontend proxies API requests to the backend via Vite config:
- Backend URL: `http://localhost:8000`
- Proxy path: `/api`

Edit `vite.config.js` to change backend URL if needed.

## Project Structure

```
src/
├── components/
│   ├── FlowBuilder/  # Canvas, Sidebar, Controls
│   └── Nodes/        # 5 node components
├── services/         # API client
├── App.jsx           # Main component
└── index.css         # Global styles
```

## Technologies

- React 18
- React Flow 11
- Axios
- Vite

## License

MIT
