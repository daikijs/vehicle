import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class ShowImgModalContent extends BSModalContext {
    constructor(public title: string, public imgURL: string, public postData: Object) {
        super();
    }
}
