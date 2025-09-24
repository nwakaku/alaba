from pathlib import Path

COLLECTION_NAME = "DeFi_Knowledge"
EMBEDDING_MODEL = "text-embedding-3-small"

# Resolve data file relative to this file to avoid CWD issues
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
FILE_PATH = DATA_DIR / "information.txt"

DATA_DIR.mkdir(parents=True, exist_ok=True)

try:
    CONTENT = FILE_PATH.read_text(encoding="utf-8")
except FileNotFoundError:
    CONTENT = ""