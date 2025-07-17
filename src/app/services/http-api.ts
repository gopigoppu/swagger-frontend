import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpApi {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  uploadUrl(url: string): Observable<any> {
    const formData = new FormData();
    formData.append('url', url);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  validate(content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/validate`, { content });
  }

  // Helper for POST+SSE workaround
  llmCorrect(content: string): Observable<any> {
    return new Observable(observer => {
      // Use fetch to POST, then open SSE with a unique id if needed
      // For this backend, we can use EventSource polyfill that supports POST, or use fetch+EventSource pattern
      // Here, we use fetch to POST and stream the response manually
      fetch(`${this.baseUrl}/llm-correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      }).then(response => {
        if (!response.body) {
          observer.error('No response body for SSE');
          return;
        }
        const reader = response.body.getReader();
        let buffer = '';
        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }
            buffer += new TextDecoder().decode(value);
            let parts = buffer.split('\n\n');
            buffer = parts.pop() || '';
            for (const part of parts) {
              if (part.trim()) {
                // Parse SSE event
                const lines = part.split('\n');
                let eventType = 'message';
                let data = '';
                for (const line of lines) {
                  if (line.startsWith('event:')) eventType = line.replace('event:', '').trim();
                  if (line.startsWith('data:')) data += line.replace('data:', '').trim();
                }
                observer.next({ event: eventType, data });
              }
            }
            read();
          });
        }
        read();
      }).catch(err => observer.error(err));
      return () => { };
    });
  }

  generate(description: string): Observable<any> {
    return new Observable(observer => {
      fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      }).then(response => {
        if (!response.body) {
          observer.error('No response body for SSE');
          return;
        }
        const reader = response.body.getReader();
        let buffer = '';
        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }
            buffer += new TextDecoder().decode(value);
            let parts = buffer.split('\n\n');
            buffer = parts.pop() || '';
            for (const part of parts) {
              if (part.trim()) {
                // Parse SSE event
                const lines = part.split('\n');
                let eventType = 'message';
                let data = '';
                for (const line of lines) {
                  if (line.startsWith('event:')) eventType = line.replace('event:', '').trim();
                  if (line.startsWith('data:')) data += line.replace('data:', '').trim();
                }
                observer.next({ event: eventType, data });
              }
            }
            read();
          });
        }
        read();
      }).catch(err => observer.error(err));
      return () => { };
    });
  }
}
