import { Route } from '@angular/router';
import { PhotoComponent } from './index';

export const PhotoRoutes: Route[] = [
  {
    path: 'photo/:id',
    component: PhotoComponent
  }
];
