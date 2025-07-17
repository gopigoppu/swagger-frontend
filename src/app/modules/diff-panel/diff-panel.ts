import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { createTwoFilesPatch } from 'diff';
import * as Diff2Html from 'diff2html';

@Component({
  selector: 'app-diff-panel',
  imports: [],
  templateUrl: './diff-panel.html',
  styleUrl: './diff-panel.scss'
})

export class DiffPanel implements OnChanges {
  @Input() original: string = '';
  @Input() correctedYaml: string = '';
  @Input() correctedJson: string = '';
  @Input() explanations: string[] = [];
  viewMode: 'diff' | 'yaml' | 'json' = 'diff';

  diffHtml: SafeHtml | null = null;
  copiedYaml = false;
  copiedJson = false;
  downloadedYaml = false;
  downloadedJson = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewMode === 'diff' && (changes['original'] || changes['correctedYaml'])) {
      this.renderDiff();
    }
  }

  renderDiff() {
    if (!this.original && !this.correctedYaml) {
      this.diffHtml = null;
      return;
    }
    const patch = createTwoFilesPatch('Original', 'Corrected', this.original, this.correctedYaml, '', '');
    const html = Diff2Html.html(patch, { drawFileList: false, matching: 'lines', outputFormat: 'side-by-side' });
    this.diffHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  copy(type: 'yaml' | 'json') {
    const text = type === 'yaml' ? this.correctedYaml : this.correctedJson;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'yaml') {
        this.copiedYaml = true;
        setTimeout(() => (this.copiedYaml = false), 1500);
      } else {
        this.copiedJson = true;
        setTimeout(() => (this.copiedJson = false), 1500);
      }
    });
  }

  download(type: 'yaml' | 'json') {
    const text = type === 'yaml' ? this.correctedYaml : this.correctedJson;
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
    if (type === 'yaml') {
      this.downloadedYaml = true;
      setTimeout(() => (this.downloadedYaml = false), 1500);
    } else {
      this.downloadedJson = true;
      setTimeout(() => (this.downloadedJson = false), 1500);
    }
  }
}