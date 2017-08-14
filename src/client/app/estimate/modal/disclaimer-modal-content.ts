import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class DisclaimerModalContent extends BSModalContext {
    constructor(public disclaimerData: string) {
        super();
    }
}
