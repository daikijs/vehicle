import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DisplayWindowModalComponent } from './display.modal.component';
import { overlayConfigFactory } from 'angular2-modal';

@Injectable()
export class DisplayModelService {
    constructor(public modal: Modal) {}

    openDialog(displayData: string, viewContainer:ViewContainerRef) {
    	this.modal.overlay.defaultViewContainer = viewContainer;
        return this.modal.open(DisplayWindowModalComponent, overlayConfigFactory({displayData: displayData}, BSModalContext));
    };
}
