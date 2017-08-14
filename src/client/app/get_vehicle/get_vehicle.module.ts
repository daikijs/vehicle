import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetVehicleComponent } from './get_vehicle.component';
import { BrowserModule } from '@angular/platform-browser';
import { SelectModule } from 'angular2-select';
import { FormsModule,
    ReactiveFormsModule
} from '@angular/forms';

@NgModule({
    imports: [CommonModule,
    BrowserModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule],
    declarations: [GetVehicleComponent],
    exports: [GetVehicleComponent]
})

export class GetVehicleModule { }
