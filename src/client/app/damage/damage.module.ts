import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule }            from '@angular/common';
import { RouterModule }            from '@angular/router';

import { ModalModule }             from 'angular2-modal';
import { BootstrapModalModule }    from 'angular2-modal/plugins/bootstrap';
import { DotSliderModule }         from '../utilities/dot-slider/dot-slider.module';

import { CarMapComponent }             from './carmap.component';
import { DamageLocationComponent }     from './damage-location.component';
import { DamageComponent }             from './damage.component';
import { AlertWindowModalComponent }   from './modal/alert.modal.component';
import { ConfirmWindowModalComponent } from './modal/confirm.modal.component';
import { DamageWindowModalComponent }  from './modal/damage.modal.component';
import { ImageMapComponent }           from '../utilities/image-map/image-map.component';
import { LevelSliderComponent }        from '../utilities/level-slider/level-slider.component';


import { ServiceModule }           from '../core/index';
import { AlertModelService }       from './modal/alert.modal.service';
import { ConfirmModelService }     from './modal/confirm.modal.service';
import { DamageModelService }      from './modal/damage.modal.service';

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      ServiceModule,
      ModalModule.forRoot(),
      BootstrapModalModule,
      DotSliderModule
    ],
    declarations: [
      DamageComponent,
      AlertWindowModalComponent,
      ConfirmWindowModalComponent,
      DamageWindowModalComponent,
      DamageLocationComponent,
      CarMapComponent,
      ImageMapComponent,
      LevelSliderComponent
    ],
    providers: [
      AlertModelService,
      DamageModelService,
      ConfirmModelService
    ],
    exports: [DamageComponent,
    RouterModule],
    entryComponents: [
      AlertWindowModalComponent,
      ConfirmWindowModalComponent,
      DamageWindowModalComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DamageModule { }
