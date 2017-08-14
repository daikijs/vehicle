import { Route } from '@angular/router';
import { NextComponent } from './index';

export const NextRoutes: Route[] = [
  {
    path: 'next/:slug',
    component: NextComponent
  }
];
