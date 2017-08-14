import { NgModule }        from '@angular/core';
import { CommonModule }    from '@angular/common';
import { MoreComponent }   from './more.component';
import { DotSliderModule } from '../utilities/dot-slider/dot-slider.module';

@NgModule({
    imports: [CommonModule, DotSliderModule],
    declarations: [MoreComponent],
    exports: [MoreComponent]
})

export class MoreModule { }
