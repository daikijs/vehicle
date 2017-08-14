import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { EstimateComponent } from './estimate.component';
import { DotSliderModule }   from '../utilities/dot-slider/dot-slider.module';
import { DisclaimerWindowModalComponent }  from './modal/disclaimer.modal.component';
import { DisclaimerModelService } from './modal/disclaimer.modal.service';

@NgModule({
    imports: [CommonModule, DotSliderModule],
    declarations: [EstimateComponent,
    	DisclaimerWindowModalComponent
    ],
    exports: [EstimateComponent],
    providers: [DisclaimerModelService],
    entryComponents: [
    	DisclaimerWindowModalComponent
    ]
})

export class EstimateModule { }
