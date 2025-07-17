import { Component } from '@angular/core';
import { HttpApi } from '../../services/http-api';
import { FormsModule } from '@angular/forms';
import { SwaggerPreview } from '../swagger-preview/swagger-preview';

@Component({
  selector: 'app-llm-generator',
  imports: [FormsModule, SwaggerPreview],
  templateUrl: './llm-generator.html',
  styleUrl: './llm-generator.scss'
})

export class LlmGenerator {
  description = '';
  loading = false;
  error: string | null = null;
  yaml: string = '';
  json: string = '';
  viewMode: 'yaml' | 'json' = 'yaml';
  copied = false;
  downloaded = false;

  constructor(private api: HttpApi) { }

  onGenerate() {
    if (!this.description) return;
    this.loading = true;
    this.error = null;
    this.yaml = '';
    this.json = '';
    let done = false;
    this.api.generate(this.description).subscribe({
      next: (event) => {
        console.log('SSE event:', event);
        try {
          const parsed = JSON.parse(event.data);
          console.log('Parsed SSE data:', parsed);
          // Set YAML/JSON as soon as available in any event
          if (parsed.corrected) {
            if (parsed.corrected.yaml !== undefined) this.yaml = parsed.corrected.yaml;
            if (parsed.corrected.json !== undefined) this.json = parsed.corrected.json;
          }
          // Show errors if present
          if (parsed.errors && parsed.errors.length) {
            this.error = parsed.errors.join('\n');
          }
          if (event.event === 'done') {
            done = true;
            this.loading = false;
          }
        } catch (e) {
          // fallback: just append raw data
          this.yaml += event.data;
        }
      },
      error: (err) => {
        this.error = err.error?.error || 'Generation failed.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  copy(type: 'yaml' | 'json') {
    const text = type === 'yaml' ? this.yaml : this.json;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    });
  }

  download(type: 'yaml' | 'json') {
    const text = type === 'yaml' ? this.yaml : this.json;
    if (!text) return;
    const blob = new Blob([text], { type: type === 'yaml' ? 'text/yaml' : 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'yaml' ? 'openapi.yaml' : 'openapi.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.downloaded = true;
    setTimeout(() => (this.downloaded = false), 1500);
  }
}
