import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class DamageModalContent extends BSModalContext {
  constructor(public autoPartID: number, public carMap: any) {
    super();
  }
}
