import type { HttpRequest, HttpResponse, HttpStack } from "tus-js-client";

export interface LogEntry {
  id: number;
  method: string;
  detail: string;
  status: string;
  failed: boolean;
}

const TICK_MS = 80;
const LATENCY_MS = 120;

/**
 * A minimal TUS 1.0.0 server (creation, offset query, resumable PATCH, termination) that
 * plugs into tus-js-client as its HTTP stack. It stores offsets instead of bytes, and lets
 * the demo cut the connection at any time.
 */
export class TusMemoryServer implements HttpStack {
  private uploads = new Map<string, { length: number; offset: number }>();
  private openRequests = new Set<() => void>();
  private downUntil = 0;
  private nextLogId = 0;

  constructor(
    private bytesPerSecond: number,
    private onLog: (entry: LogEntry) => void
  ) {}

  getName() {
    return "TusMemoryServer";
  }

  /** Cut open connections and refuse new ones for a moment. The server keeps what it received. */
  dropConnection(durationMs = 1200) {
    this.downUntil = Date.now() + durationMs;
    this.openRequests.forEach((fail) => fail());
  }

  private log(method: string, detail: string, status: string, failed = false) {
    this.onLog({ id: this.nextLogId++, method, detail, status, failed });
  }

  createRequest(method: string, url: string): HttpRequest {
    const headers = new Map<string, string>();
    let onProgress: (sent: number) => void = () => {};
    let timer: ReturnType<typeof setTimeout> | undefined;
    let fail: (() => void) | undefined;

    const finish = () => {
      clearTimeout(timer);
      if (fail) this.openRequests.delete(fail);
    };

    const send = (body: Blob | null) =>
      new Promise<HttpResponse>((resolve, reject) => {
        const header = (name: string) => headers.get(name.toLowerCase());
        const respond = (status: number, responseHeaders: Record<string, string | number>, detail: string) => {
          finish();
          this.log(method, detail, String(status), status >= 400);
          resolve(response(status, responseHeaders));
        };
        fail = () => {
          finish();
          this.log(method, method === "PATCH" ? `connection lost at offset ${this.uploads.get(url)?.offset ?? 0}` : "no connection", "✕", true);
          reject(new Error("Network error"));
        };
        this.openRequests.add(fail);

        timer = setTimeout(() => {
          if (Date.now() < this.downUntil) return fail?.();
          const upload = this.uploads.get(url);

          if (method === "POST") {
            const location = `${url}${crypto.randomUUID().slice(0, 8)}`;
            const length = Number(header("Upload-Length"));
            this.uploads.set(location, { length, offset: 0 });
            return respond(201, { location }, `Upload-Length: ${length}`);
          }
          if (!upload) return respond(404, {}, "unknown upload");
          if (method === "HEAD") {
            return respond(200, { "upload-offset": upload.offset, "upload-length": upload.length }, `Upload-Offset: ${upload.offset}`);
          }
          if (method === "DELETE") {
            this.uploads.delete(url);
            return respond(204, {}, "upload removed");
          }

          // PATCH
          const from = Number(header("Upload-Offset"));
          if (from !== upload.offset) return respond(409, {}, "offset conflict");
          const size = body?.size ?? 0;
          this.log("PATCH", `sending from offset ${from}`, "…");
          const receive = () => {
            upload.offset = Math.min(from + size, upload.offset + Math.round((this.bytesPerSecond * TICK_MS) / 1000));
            onProgress(upload.offset - from);
            if (upload.offset === from + size) return respond(204, { "upload-offset": upload.offset }, `Upload-Offset: ${upload.offset}`);
            timer = setTimeout(receive, TICK_MS);
          };
          receive();
        }, LATENCY_MS);
      });

    return {
      getMethod: () => method,
      getURL: () => url,
      setHeader: (name, value) => void headers.set(name.toLowerCase(), String(value)),
      getHeader: (name) => headers.get(name.toLowerCase()),
      setProgressHandler: (handler) => {
        onProgress = handler;
      },
      send,
      abort: async () => {
        // Like XMLHttpRequest, an aborted request neither resolves nor rejects.
        finish();
        if (method === "PATCH") this.log("PATCH", `paused at offset ${this.uploads.get(url)?.offset ?? 0}`, "—");
      },
      getUnderlyingObject: () => undefined,
    };
  }
}

function response(status: number, headers: Record<string, string | number>): HttpResponse {
  return {
    getStatus: () => status,
    getHeader: (name) => {
      const value = headers[name.toLowerCase()];
      return value === undefined ? undefined : String(value);
    },
    getBody: () => "",
    getUnderlyingObject: () => undefined,
  };
}
