import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class UploadModalContent extends BSModalContext {
    constructor(public imgLIST: Object[], public index: number, public postData: Object) {
        super();
    }
}
