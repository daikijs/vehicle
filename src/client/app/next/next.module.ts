import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { NextComponent } from './next.component';

@NgModule({
    imports: [CommonModule],
    declarations: [NextComponent
    ],
    exports: [NextComponent]
})

export class NextModule { }
