import { Route } from '@angular/router';
import { WelcomeComponent } from './index';

export const WelcomeRoutes: Route[] = [
  {
    path: 'welcome/:slugId',
    component: WelcomeComponent
  }
];
