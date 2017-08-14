import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class DisplayModalContent extends BSModalContext {
    constructor(public displayData: string) {
        super();
    }
}
