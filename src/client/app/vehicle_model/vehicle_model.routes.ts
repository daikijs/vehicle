import { Route } from '@angular/router';
import { VehicleModelComponent } from './index';

export const VehicleModelRoutes: Route[] = [
  {
    path: 'vehicle_model/ps/:profile_slug/:zipcode',
    component: VehicleModelComponent
  }
];
