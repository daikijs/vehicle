import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class ConfirmModalContent extends BSModalContext {
    constructor(public carmapHandler: any, markId: number) {
        super();
    }
}
