import { inject, TestBed, async } from '@angular/core/testing';
import { DamageModelService } from './damage.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Damage modal service', () => {
    let damageModelService: DamageModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          DamageModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ]
      }).compileComponents();
    });

    beforeEach(inject([DamageModelService], (modalService: DamageModelService, view: ViewContainerRef) => {
      damageModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>damageModelService).modal, 'open').and.returnValue(
          Promise.resolve(1)
        );
        damageModelService.openDialog(1, null, viewRef);
        expect((<any>damageModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
