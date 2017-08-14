import { Component
}  from '@angular/core';
import { Router }                    from '@angular/router';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { DisplayModalContent }    from './display-modal-content';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'display.modal.component.html',
    styleUrls: ['display.modal.component.css']
})
export class DisplayWindowModalComponent implements ModalComponent<DisplayModalContent> {
    context: DisplayModalContent;
    displayData: string;

    constructor(public dialog: DialogRef<DisplayModalContent>,
        private router: Router) {
        this.context = dialog.context;
        this.displayData = this.context.displayData;
        this.loadData();
    }

    loadData(counter: number = 0) {
        if(counter > 50) {
            console.log('Fail to load the display data');
        } else if($('.display-wrapper .display-body').length <= 0) {
            counter ++;
            setTimeout(() => this.loadData(counter), 50);
        } else {
            $('.display-wrapper .display-body').html(this.displayData);
        }
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
