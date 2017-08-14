import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { UploadWindowModalComponent } from './upload.modal.component';
import { overlayConfigFactory } from 'angular2-modal';

@Injectable()
export class UploadModelService {
    constructor(public modal: Modal) {}

    openDialog(imgLIST: Object[], index: number, postData: Object, viewContainer:ViewContainerRef) {
    	this.modal.overlay.defaultViewContainer = viewContainer;
        return this.modal.open(UploadWindowModalComponent, overlayConfigFactory(
        	{ imgLIST: imgLIST, index: index, postData: postData}, BSModalContext));
    };
}
