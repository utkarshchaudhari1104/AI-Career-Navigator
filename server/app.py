import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
PORT = int(os.getenv('PORT', '5000'))

class Handler(BaseHTTPRequestHandler):
    def _json(self, status, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', os.getenv('CLIENT_URL', '*'))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/api/health':
            return self._json(200, {'status': 'ok', 'message': 'AI Career Navigator Python API is running'})
        if path == '/api/careers':
            return self._json(200, [
                {'id': 'ai-ml-engineer', 'title': 'AI/ML Engineer', 'match': 92},
                {'id': 'data-scientist', 'title': 'Data Scientist', 'match': 87},
                {'id': 'python-developer', 'title': 'Python Developer', 'match': 81},
            ])
        if path == '/api/recommendations':
            return self._json(200, {'recommended': [
                {'careerId': 'ai-ml-engineer', 'score': 92},
                {'careerId': 'data-scientist', 'score': 87},
            ]})
        return self._serve(path)

    def do_POST(self):
        path = urlparse(self.path).path
        if path != '/api/profile':
            return self._json(404, {'message': 'Not found'})
        length = int(self.headers.get('Content-Length', '0'))
        try:
            profile = json.loads(self.rfile.read(length) or '{}')
        except json.JSONDecodeError:
            return self._json(400, {'message': 'Request body must be valid JSON'})
        (ROOT / 'server' / 'profile.json').write_text(json.dumps(profile, indent=2), encoding='utf-8')
        return self._json(201, profile)

    def _serve(self, path):
        relative = path.lstrip('/') or 'index.html'
        file_path = DIST / relative
        if not file_path.is_file():
            file_path = DIST / 'index.html'
        if not file_path.is_file():
            return self._json(404, {'message': 'Build the frontend first with npm run build'})
        content_type = 'text/html; charset=utf-8' if file_path.suffix == '.html' else 'text/css' if file_path.suffix == '.css' else 'application/javascript' if file_path.suffix == '.js' else 'application/octet-stream'
        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

if __name__ == '__main__':
    print(f'AI Career Navigator running at http://localhost:{PORT}')
    ThreadingHTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
