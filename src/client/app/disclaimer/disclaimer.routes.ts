import { Route } from '@angular/router';
import { DisclaimerComponent } from './index';

export const DisclaimerRoutes: Route[] = [
  {
    path: 'disclaimer',
    component: DisclaimerComponent
  },
  {
    path: 'disclaimer/:slug',
    component: DisclaimerComponent
  }
];
