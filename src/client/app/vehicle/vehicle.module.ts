import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule }         from '@angular/router';
import { VehicleComponent }     from './vehicle.component';
import { DotSliderModule }      from '../utilities/dot-slider/dot-slider.module';

@NgModule({
    imports: [CommonModule, RouterModule, DotSliderModule],
    declarations: [VehicleComponent],
    exports: [VehicleComponent, RouterModule]
})

export class VehicleModule { }
