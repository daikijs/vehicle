import { Routes } from '@angular/router';

import { AboutRoutes } from './about/index';
import { HomeRoutes } from './home/index';
import { HelpRoutes } from './help/index';
import { DisclaimerRoutes } from './disclaimer/index';
import { VehicleRoutes } from './vehicle/index';
import { WelcomeRoutes } from './welcome/index';
import { DamageRoutes } from './damage/index';
import { PhotoRoutes } from './photo/index';
import { EstimateRoutes } from './estimate/index';
import { NextRoutes } from './next/index';
import { MoreRoutes } from './more/index';
import { ZipRoutes } from './zip/index';
import { VehicleModelRoutes } from './vehicle_model/index';
import { GetVehicleRoutes } from './get_vehicle/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...DisclaimerRoutes,
  ...HelpRoutes,
  ...VehicleRoutes,
  ...DamageRoutes,
  ...PhotoRoutes,
  ...EstimateRoutes,
  ...NextRoutes,
  ...ZipRoutes,
  ...VehicleModelRoutes,
  ...MoreRoutes,
  ...WelcomeRoutes,
  ...GetVehicleRoutes
];
