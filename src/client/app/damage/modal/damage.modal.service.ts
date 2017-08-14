import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { overlayConfigFactory, DialogRef } from 'angular2-modal';
import { DamageWindowModalComponent } from './damage.modal.component';

@Injectable()
export class DamageModelService {
	dialog: DialogRef<BSModalContext>;
	bClose: boolean;

    constructor(public modal: Modal) {
    }

    openDialog(autoPartID: number, carMap:any, viewContainer: ViewContainerRef) {
    	this.bClose = false;
    	this.modal.overlay.defaultViewContainer = viewContainer;
        return this.modal.open(DamageWindowModalComponent,  overlayConfigFactory({ autoPartID: autoPartID,
        	carMap: carMap}, BSModalContext))
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
			this.bClose = true;
		}
	}
}
