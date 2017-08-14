import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleModelComponent } from './vehicle_model.component';

@NgModule({
    imports: [CommonModule,
    FormsModule],
    declarations: [VehicleModelComponent],
    exports: [VehicleModelComponent]
})

export class VehicleModelModule { }
