import { Route } from '@angular/router';
import { EstimateComponent } from './index';

export const EstimateRoutes: Route[] = [
  {
    path: 'estimate/:id',
    component: EstimateComponent
  }
];
