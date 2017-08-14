import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZipComponent } from './zip.component';

@NgModule({
    imports: [CommonModule,
    FormsModule],
    declarations: [ZipComponent],
    exports: [ZipComponent]
})

export class ZipModule { }
