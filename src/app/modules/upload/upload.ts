import { Component, EventEmitter, Output } from '@angular/core';
import { HttpApi } from '../../services/http-api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  imports: [FormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class Upload {
  selectedFile: File | null = null;
  url: string = '';
  progress = 0;
  error: string | null = null;

  @Output() contentLoaded = new EventEmitter<string>();

  constructor(private api: HttpApi) { }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    this.progress = 0;
    this.error = null;
    this.api.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        this.progress = 100;
        this.contentLoaded.emit(res.content);
      },
      error: (err) => {
        this.error = err.error?.error || 'Upload failed.';
        this.progress = 0;
      }
    });
  }

  uploadUrl() {
    if (!this.url) return;
    this.progress = 0;
    this.error = null;
    this.api.uploadUrl(this.url).subscribe({
      next: (res) => {
        this.progress = 100;
        this.contentLoaded.emit(res.content);
      },
      error: (err) => {
        this.error = err.error?.error || 'Upload failed.';
        this.progress = 0;
      }
    });
  }

  onSubmit() { }
}