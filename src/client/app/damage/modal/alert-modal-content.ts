import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class AlertModalContent extends BSModalContext {
    constructor(public claimID: string) {
        super();
    }
}
