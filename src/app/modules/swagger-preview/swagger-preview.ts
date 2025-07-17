import {
  AfterViewInit, Component, ElementRef, Input,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import * as YAML from 'yaml';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

@Component({
  selector: 'app-swagger-preview',
  // imports: [SwaggerUI],
  templateUrl: './swagger-preview.html',
  styleUrl: './swagger-preview.scss'
})

export class SwaggerPreview implements OnChanges, AfterViewInit {
  @Input() spec: string = '';
  @ViewChild('swaggerContainer') swaggerContainer!: ElementRef;
  private initialized = false;

  ngAfterViewInit() {
    this.initialized = true;
    this.renderSwagger();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && (changes['spec'] && changes['spec'].currentValue)) {
      this.renderSwagger();
    }
  }

  renderSwagger() {
    if (!this.swaggerContainer) return;
    let parsed: any = {};
    try {
      parsed = YAML.parse(this.spec);
    } catch {
      try {
        parsed = JSON.parse(this.spec);
      } catch {
        parsed = {};
      }
    }
    // Guard: do not render if parsed spec is empty or not an object
    if (!parsed || (typeof parsed === 'object' && Object.keys(parsed).length === 0)) {
      this.swaggerContainer.nativeElement.innerHTML = '';
      return;
    }
    this.swaggerContainer.nativeElement.innerHTML = '';
    if (this.swaggerContainer) {
      SwaggerUIBundle({
        domNode: this.swaggerContainer.nativeElement,
        spec: parsed, // Use the parsed spec object
        presets: [
          SwaggerUIStandalonePreset // The standalone preset for layout
        ],
        layout: 'BaseLayout', // Use 'BaseLayout' as specified in your original code
        docExpansion: 'none',
        deepLinking: true,
        // Add any other Swagger UI options here as needed
      });
    }
  }
}
