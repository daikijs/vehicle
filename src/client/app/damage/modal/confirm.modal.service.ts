import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { overlayConfigFactory } from 'angular2-modal';
import { ConfirmWindowModalComponent } from './confirm.modal.component';

@Injectable()
export class ConfirmModelService {
    constructor(public modal: Modal) {}

    openDialog(carmapHandler: any, markId: number, viewContainer: ViewContainerRef) {
    	this.modal.overlay.defaultViewContainer = viewContainer;
    	return this.modal.open(ConfirmWindowModalComponent,  overlayConfigFactory({ carmapHandler: carmapHandler,
    		markId: markId}, BSModalContext));
    };
}
