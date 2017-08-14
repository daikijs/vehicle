import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class PlayerModalContent extends BSModalContext {
    constructor(public imgURL: string) {
        super();
    }
}
