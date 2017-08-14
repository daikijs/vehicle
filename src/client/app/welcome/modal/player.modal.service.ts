import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { PlayerWindowModalComponent } from './player.modal.component';
import { overlayConfigFactory } from 'angular2-modal';

@Injectable()
export class PlayerModelService {
    constructor(public modal: Modal) {}

    openDialog(imgURL: string, viewContainer:ViewContainerRef) {
    	this.modal.overlay.defaultViewContainer = viewContainer;
        return this.modal.open(PlayerWindowModalComponent, overlayConfigFactory({imgURL: imgURL}, BSModalContext));
    };
}
