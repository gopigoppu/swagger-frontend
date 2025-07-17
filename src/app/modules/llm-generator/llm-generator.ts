import { Component } from '@angular/core';
import { HttpApi } from '../../services/http-api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-llm-generator',
  imports: [FormsModule],
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
    this.api.generate(this.description).subscribe({
      next: (res) => {
        this.yaml = res.yaml || '';
        this.json = res.json || '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Generation failed.';
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
