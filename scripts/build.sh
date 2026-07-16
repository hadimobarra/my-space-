#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="$ROOT_DIR/_site"

echo "==> Cleaning _site/"
rm -rf "$SITE_DIR"

build_app() {
  local app="$1"
  local target_dir="$2"
  local APP_DIR="$ROOT_DIR/apps/$app"

  echo "==> Building $app..."
  (cd "$APP_DIR" && npm run build)

  echo "==> Copying $app/out/ -> $target_dir"
  mkdir -p "$target_dir"
  cp -r "$APP_DIR/out/"* "$target_dir/"
}

# Landing page goes at the root
build_app "landing" "$SITE_DIR"

# Sub-projects go under their basePath directories
build_app "project-a" "$SITE_DIR/project-a"
build_app "project-b" "$SITE_DIR/project-b"

echo "==> Adding .nojekyll for GitHub Pages"
touch "$SITE_DIR/.nojekyll"

echo "==> Site ready at _site/"
find "$SITE_DIR" -maxdepth 2 -name "*.html" | sort
