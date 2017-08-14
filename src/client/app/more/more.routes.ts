import { Route } from '@angular/router';
import { MoreComponent } from './index';

export const MoreRoutes: Route[] = [
  {
    path: 'more/:slug',
    component: MoreComponent
  }
];
