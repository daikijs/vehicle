import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { AlertWindowModalComponent } from './alert.modal.component';
import { overlayConfigFactory, DialogRef } from 'angular2-modal';

@Injectable()
export class AlertModelService {
	dialog: DialogRef<BSModalContext>;

    constructor(public modal: Modal) {}

    openDialog(claimID: string, viewContainer:ViewContainerRef) {
    	this.modal.overlay.defaultViewContainer = viewContainer;

        this.modal.open(AlertWindowModalComponent, overlayConfigFactory({ claimID: claimID}, BSModalContext))
		.then((dialog: DialogRef<BSModalContext>) => {
			this.dialog = dialog;
			return dialog.result;
		})
		.then(() => {
			console.log('closed');
			this.destroyModal();
		})
		.catch(() => {
			console.log('dismissed');
			this.destroyModal();
		});
    };

	destroyModal () {
		if (this.dialog && this.dialog.overlay) {
			if(this.dialog.overlay.defaultViewContainer) {
				this.dialog.overlay.defaultViewContainer.clear();
			}

			this.dialog = null;
		}
	}
}
