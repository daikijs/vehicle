import { NgModule,
	     CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { APP_BASE_HREF }        from '@angular/common';
import { RouterModule }         from '@angular/router';
import { HttpModule }           from '@angular/http';
import { AppComponent }         from './app.component';
import { routes }               from './app.routes';

import { AboutModule }             from './about/about.module';
import { HomeModule }              from './home/home.module';
import { HelpModule }              from './help/help.module';
import { WelcomeModule }           from './welcome/welcome.module';
import { ZipModule }               from './zip/zip.module';
import { DisclaimerModule }        from './disclaimer/disclaimer.module';
import { VehicleModule }           from './vehicle/vehicle.module';
import { DamageModule }            from './damage/damage.module';
import { PhotoModule }             from './photo/photo.module';
import { EstimateModule }          from './estimate/estimate.module';
import { NextModule }              from './next/next.module';
import { MoreModule }              from './more/more.module';
import { SharedModule }            from './shared/shared.module';
import { VehicleModelModule }      from './vehicle_model/vehicle_model.module';
import { GetVehicleModule }        from './get_vehicle/get_vehicle.module';

@NgModule({
  imports: [BrowserModule,
            HttpModule,
            RouterModule.forRoot(routes, {useHash: true}),
            AboutModule,
            HomeModule,
            HelpModule,
            ZipModule,
            DisclaimerModule,
            VehicleModule,
            DamageModule,
            PhotoModule,
            EstimateModule,
            NextModule,
            WelcomeModule,
            MoreModule,
            VehicleModelModule,
            GetVehicleModule,
            SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
