import { Route } from '@angular/router';
import { GetVehicleComponent } from './index';

export const GetVehicleRoutes: Route[] = [
  {
    path: 'get_vehicle/:slugId',
    component: GetVehicleComponent
  }
];
