#!/usr/bin/env python3
"""Generate a deterministic SHA-256 inventory for CYBERAWARE 3D project files."""
import hashlib
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "package-manifest.json"
EXCLUDED_DIRS = {
    ".git", "node_modules", "release-artifacts", "test-results",
    "playwright-report", "dist-react", "__pycache__", ".pytest_cache",
    ".mypy_cache", ".ruff_cache", ".cache", "coverage", ".venv", "venv",
}


def inventory_files(root: Path):
    """Yield regular, non-excluded files; reject links to keep archives deterministic."""
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root)
        if path.is_symlink():
            raise ValueError(f"Refusing symbolic link in package source tree: {relative.as_posix()}")
        if path.is_dir():
            continue
        if not path.is_file():
            continue
        if any(part in EXCLUDED_DIRS for part in relative.parts):
            continue
        if any(part.startswith(".env") for part in relative.parts):
            continue
        if path.name == ".DS_Store" or relative.as_posix() == "package-manifest.json":
            continue
        yield path


def generate_manifest(root: Path, output: Path):
    files = []
    for path in inventory_files(root):
        rel = path.relative_to(root).as_posix()
        data = path.read_bytes()
        files.append({
            "path": rel,
            "sizeBytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
        })
    manifest = {
        "project": "CYBERAWARE 3D",
        "manifestVersion": "1.5.0",
        "generated": date.today().isoformat(),
        "hashAlgorithm": "SHA-256",
        "selfExcluded": True,
        "fileCount": len(files),
        "files": files,
    }
    output.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return len(files)


if __name__ == "__main__":
    count = generate_manifest(ROOT, OUTPUT)
    print(f"PACKAGE MANIFEST: PASS ({count} files hashed; links and excluded files rejected/skipped; manifest excludes itself)")
