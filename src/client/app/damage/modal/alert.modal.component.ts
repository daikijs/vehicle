import { Component,
    OnInit,
    ElementRef } from '@angular/core';
import { DialogRef,
    ModalComponent } from 'angular2-modal';
import { AlertModalContent } from './alert-modal-content';
import { Router }            from '@angular/router';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'alert.modal.component.html',
    styleUrls: ['alert.modal.component.css']
})
export class AlertWindowModalComponent implements ModalComponent<AlertModalContent>, OnInit {
    context: AlertModalContent;
    productId: any;
    modalType: boolean;
    slug: string;
    availableModalClass: string;

    circleImgLeft: number;
    handImgLeft: number;

    constructor(public dialog: DialogRef<AlertModalContent>,
        private element: ElementRef,
        private router: Router) {
        this.context = dialog.context;
        let slug = dialog.context.claimID;
        if(slug === '0') {
            this.modalType = false;
        } else {
            this.modalType = true;
            this.slug = slug;
        }
    }

    ngOnInit() {
        this.initStyle();
    }

    initStyle(count: number = 0) {
        let $modalBody = $('.damage-alert-modal .modal-body');

        if(count > 50) {
            console.log('Fail to load the alert modal .');
        } else if($modalBody.length <= 0) {
            count ++;
            setTimeout(() => this.initStyle(count), 50);
        } else {
            let modalPadding = parseInt($modalBody.css('padding-top'));
            let modalWidth = $('.damage-alert-modal').width();
            this.circleImgLeft = modalWidth / 2 - 25 - modalPadding;
            this.handImgLeft = modalWidth / 2 - 10 - modalPadding;
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

    next() {
        this.dialog.close();
        this.router.navigate(['/photo', this.slug]);
    }
}
