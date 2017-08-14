import { Component
}  from '@angular/core';
import { Router }                    from '@angular/router';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { DisclaimerModalContent }    from './disclaimer-modal-content';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'disclaimer.modal.component.html',
    styleUrls: ['disclaimer.modal.component.css']
})
export class DisclaimerWindowModalComponent implements ModalComponent<DisclaimerModalContent> {
    context: DisclaimerModalContent;
    disclaimerData: string;

    constructor(public dialog: DialogRef<DisclaimerModalContent>,
        private router: Router) {
        this.context = dialog.context;
        this.disclaimerData = this.context.disclaimerData;
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

    gotoHome() {
        this.dialog.close();
        this.router.navigate(['/']);
    }
}
