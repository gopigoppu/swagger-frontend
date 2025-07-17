
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation-results',
  templateUrl: './validation-results.html',
  styleUrl: './validation-results.scss'
})
export class ValidationResults {
  @Input() valid: boolean | null = null;
  @Input() errors: string[] = [];
}
