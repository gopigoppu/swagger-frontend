import {
  AfterViewInit, Component, ElementRef, Input,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import * as YAML from 'yaml';
import SwaggerUI from 'swagger-ui-dist';
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
    this.swaggerContainer.nativeElement.innerHTML = '';
    if (this.swaggerContainer) {
      // SwaggerUI({
      //   domNode: this.swaggerContainer.nativeElement,
      //   spec: parsed,
      //   presets: [SwaggerUI.presets.apis],
      //   layout: 'BaseLayout',
      //   docExpansion: 'none',
      //   deepLinking: true
      // });
      SwaggerUIBundle({
        domNode: this.swaggerContainer.nativeElement,
        spec: parsed, // Use the parsed spec object
        // Access presets directly from SwaggerUIBundle
        presets: [
          // SwaggerUIBundle.presets.apis, // The default APIs preset
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
