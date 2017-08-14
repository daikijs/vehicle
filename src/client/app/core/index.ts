import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { DataService }         from './data.service';
import { StoreService }        from './store.service';
import { NavbarService }       from './navbar.service';
import { EventService }        from './event.service';
import { DisplayWindowModalComponent } from './modal/display/display.modal.component';
import { DisplayModelService } from './modal/display/display.modal.service';

@NgModule({
    imports: [CommonModule],
    providers: [
      DataService,
      StoreService,
      NavbarService,
      EventService,
      DisplayModelService
    ],
    declarations: [
    	DisplayWindowModalComponent
    ],
    entryComponents: [
    	DisplayWindowModalComponent
    ]
})

export class ServiceModule { }
