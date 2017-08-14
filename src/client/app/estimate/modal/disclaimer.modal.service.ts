import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DisclaimerWindowModalComponent } from './disclaimer.modal.component';
import { overlayConfigFactory } from 'angular2-modal';

@Injectable()
export class DisclaimerModelService {
    constructor(public modal: Modal) {}

    openDialog(disclaimerData: string, viewContainer:ViewContainerRef) {
    	this.modal.overlay.defaultViewContainer = viewContainer;
        return this.modal.open(DisclaimerWindowModalComponent, overlayConfigFactory({disclaimerData: disclaimerData}, BSModalContext));
    };
}
