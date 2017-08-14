import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ShowImgWindowModalComponent } from './show.img.modal.component';
import { overlayConfigFactory } from 'angular2-modal';

@Injectable()
export class ShowImgModelService {
    constructor(public modal: Modal) {}

    openDialog(title: string, imgURL: string, postData: Object, viewContainer:ViewContainerRef) {
    	this.modal.overlay.defaultViewContainer = viewContainer;
        return this.modal.open(ShowImgWindowModalComponent, overlayConfigFactory({
        	title: title,
        	imgURL: imgURL,
        	postData: postData
        }, BSModalContext));
    };
}
