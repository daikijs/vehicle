import { Component
}  from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { PlayerModalContent }    from './player-modal-content';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'player.modal.component.html',
    styleUrls: ['player.modal.component.css']
})
export class PlayerWindowModalComponent implements ModalComponent<PlayerModalContent> {
    context: PlayerModalContent;
    sources: Array<Object>;

    constructor(public dialog: DialogRef<PlayerModalContent>) {
        this.context = dialog.context;
        this.sources = [
            {
                src: 'https://new-api.virtualevaluator.net/explainer.mp4',
                type: 'video/mp4'
            }
        ];
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }

    closeModal() {
        this.dialog.close();
    }
}
