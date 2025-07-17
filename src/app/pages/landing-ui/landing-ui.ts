import { Component } from '@angular/core';
import { DiffPanel } from '../../modules/diff-panel/diff-panel';
import { SwaggerPreview } from '../../modules/swagger-preview/swagger-preview';
import { Upload } from '../../modules/upload/upload';
import { ValidationResults } from '../../modules/validation-results/validation-results';
import { HttpApi } from '../../services/http-api';

@Component({
  selector: 'app-landing-ui',
  imports: [
    Upload,
    ValidationResults,
    DiffPanel,
    SwaggerPreview
  ],
  templateUrl: './landing-ui.html',
  styleUrl: './landing-ui.scss'
})

export class LandingUi {
  uploadedContent: string | null = null;
  validation: { valid: boolean | null, errors: string[] } = { valid: null, errors: [] };
  loadingValidation = false;

  correction: any = null;
  correctionLoading = false;
  correctionError: string | null = null;

  constructor(private api: HttpApi) { }

  onContentLoaded(content: string) {
    this.uploadedContent = content;
    this.validation = { valid: null, errors: [] };
    this.correction = null;
    this.correctionError = null;
    this.runValidation(content);
  }

  runValidation(content: string) {
    this.loadingValidation = true;
    this.api.validate(content).subscribe({
      next: (res) => {
        this.validation = { valid: res.valid, errors: res.errors };
        this.loadingValidation = false;
      },
      error: (err) => {
        this.validation = { valid: false, errors: [err.error?.error || 'Validation failed.'] };
        this.loadingValidation = false;
      }
    });
  }

  triggerCorrection() {
    if (!this.uploadedContent) return;
    this.correction = null;
    this.correctionError = null;
    this.correctionLoading = true;
    let corrected: any = {};
    this.api.llmCorrect(this.uploadedContent).subscribe({
      next: (event) => {
        if (event.event === 'correction' || event.event === 'done') {
          try {
            const data = JSON.parse(event.data);
            corrected = data.corrected || {};
            this.correction = {
              original: this.uploadedContent,
              correctedYaml: corrected.yaml || '',
              correctedJson: corrected.json || '',
              explanations: corrected.explanations || data.explanations || []
            };
          } catch (e) {
            this.correctionError = 'Failed to parse correction.';
          }
        }
        if (event.event === 'done') {
          this.correctionLoading = false;
        }
      },
      error: (err) => {
        this.correctionError = 'Correction failed.';
        this.correctionLoading = false;
      },
      complete: () => {
        this.correctionLoading = false;
      }
    });
  }

  reset() {
    this.uploadedContent = null;
    this.validation = { valid: null, errors: [] };
    this.loadingValidation = false;
    this.correction = null;
    this.correctionLoading = false;
    this.correctionError = null;
  }
}
