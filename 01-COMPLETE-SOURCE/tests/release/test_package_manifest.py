import json
import tempfile
import unittest
from pathlib import Path

from scripts.generate_package_manifest import generate_manifest


class PackageManifestGeneratorTests(unittest.TestCase):
    def test_exclusions_match_release_inventory_policy(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "src").mkdir()
            (root / "node_modules").mkdir()
            (root / "release-artifacts").mkdir()
            (root / "__pycache__").mkdir()
            (root / ".pytest_cache").mkdir()
            (root / ".cache").mkdir()
            (root / "src" / "app.js").write_text("ok", encoding="utf-8")
            (root / ".DS_Store").write_bytes(b"metadata")
            (root / ".env.local").write_text("SECRET=example", encoding="utf-8")
            (root / "node_modules" / "dependency.js").write_text("excluded", encoding="utf-8")
            (root / "release-artifacts" / "old.zip").write_bytes(b"excluded")
            (root / "__pycache__" / "module.pyc").write_bytes(b"compiled")
            (root / ".pytest_cache" / "lastfailed").write_text("cached", encoding="utf-8")
            (root / ".cache" / "tool-state").write_text("cached", encoding="utf-8")
            output = root / "package-manifest.json"

            count = generate_manifest(root, output)
            manifest = json.loads(output.read_text(encoding="utf-8"))
            self.assertEqual(count, 1)
            self.assertEqual([item["path"] for item in manifest["files"]], ["src/app.js"])
            self.assertEqual(manifest["manifestVersion"], "1.5.0")

    def test_symbolic_links_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "real.txt").write_text("safe", encoding="utf-8")
            try:
                (root / "linked.txt").symlink_to(root / "real.txt")
            except (OSError, NotImplementedError):
                self.skipTest("symbolic links are unavailable on this platform")
            with self.assertRaisesRegex(ValueError, "symbolic link"):
                generate_manifest(root, root / "package-manifest.json")


if __name__ == "__main__":
    unittest.main()
