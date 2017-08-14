import { Route } from '@angular/router';
import { HomeComponent } from './index';

export const HomeRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'ps/:profile_slug',
    component: HomeComponent
  }
];
