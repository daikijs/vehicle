import { Route } from '@angular/router';
import { VehicleComponent } from './index';

export const VehicleRoutes: Route[] = [
  {
    path: 'vehicle/:id',
    component: VehicleComponent
  }
];
