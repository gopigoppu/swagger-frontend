import { Routes } from '@angular/router';
import { SwaggerPreview } from './modules/swagger-preview/swagger-preview';
import { Upload } from './modules/upload/upload';
import { ValidationResults } from './modules/validation-results/validation-results';
import { DiffPanel } from './modules/diff-panel/diff-panel';
import { LlmGenerator } from './modules/llm-generator/llm-generator';
import { App } from './app';
import { LandingUi } from './pages/landing-ui/landing-ui';

export const routes: Routes = [
    {
        path: '',
        component: LandingUi
    },
    {
        path: 'swagger',
        component: SwaggerPreview
    },
    {
        path: 'upload',
        component: Upload
    },
    {
        path: 'generate-swagger',
        component: LlmGenerator
    }
];
