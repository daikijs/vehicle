import { Route } from '@angular/router';
import { DamageComponent } from './index';

export const DamageRoutes: Route[] = [
  {
    path: 'damage/:id',
    component: DamageComponent
  }
];
