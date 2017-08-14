import { Route } from '@angular/router';
import { ZipComponent } from './index';

export const ZipRoutes: Route[] = [
  {
    path: 'zip/ps/:profile_slug',
    component: ZipComponent
  }
];
