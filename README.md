# PASTER // TERMINAL

A pastebin-style web application with a Marathon (Bungie 1994) inspired "Graphic Realism" art style.

## Stack
- **Backend**: Python 3.11+, FastAPI, SQLite (stdlib)
- **Frontend**: React 18, TypeScript, Vite, React Router v6

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (dev)
```bash
cd frontend
npm install
npm run dev
```

### Frontend (production build)
```bash
cd frontend
npm run build
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pastes | List all pastes |
| POST | /api/pastes | Create a paste |
| GET | /api/pastes/{id} | Get a paste |
| PUT | /api/pastes/{id} | Update a paste |
| DELETE | /api/pastes/{id} | Delete a paste |
