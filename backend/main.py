import sqlite3
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB_PATH = "pastes.db"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS pastes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                language TEXT NOT NULL DEFAULT 'text',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        conn.commit()


init_db()


class PasteCreate(BaseModel):
    title: str = ""
    content: str
    language: str = "text"


class PasteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    language: Optional[str] = None


@app.get("/api/pastes")
def list_pastes():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, title, language, created_at FROM pastes ORDER BY created_at DESC"
        ).fetchall()
    return [dict(row) for row in rows]


@app.post("/api/pastes", status_code=201)
def create_paste(paste: PasteCreate):
    paste_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO pastes (id, title, content, language, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            (paste_id, paste.title, paste.content, paste.language, now, now),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM pastes WHERE id = ?", (paste_id,)).fetchone()
    return dict(row)


@app.get("/api/pastes/{paste_id}")
def get_paste(paste_id: str):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM pastes WHERE id = ?", (paste_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Paste not found")
    return dict(row)


@app.put("/api/pastes/{paste_id}")
def update_paste(paste_id: str, paste: PasteUpdate):
    with get_db() as conn:
        existing = conn.execute("SELECT * FROM pastes WHERE id = ?", (paste_id,)).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="Paste not found")
        current = dict(existing)
        title = paste.title if paste.title is not None else current["title"]
        content = paste.content if paste.content is not None else current["content"]
        language = paste.language if paste.language is not None else current["language"]
        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "UPDATE pastes SET title = ?, content = ?, language = ?, updated_at = ? WHERE id = ?",
            (title, content, language, now, paste_id),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM pastes WHERE id = ?", (paste_id,)).fetchone()
    return dict(row)


@app.delete("/api/pastes/{paste_id}", status_code=204)
def delete_paste(paste_id: str):
    with get_db() as conn:
        existing = conn.execute("SELECT id FROM pastes WHERE id = ?", (paste_id,)).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="Paste not found")
        conn.execute("DELETE FROM pastes WHERE id = ?", (paste_id,))
        conn.commit()
