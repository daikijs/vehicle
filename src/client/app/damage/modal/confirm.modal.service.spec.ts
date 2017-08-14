import { inject, TestBed, async } from '@angular/core/testing';
import { ConfirmModelService } from './confirm.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Confirm modal service', () => {
    let confirmModelService: ConfirmModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          ConfirmModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ]
      }).compileComponents();
    });

    beforeEach(inject([ConfirmModelService], (modalService: ConfirmModelService, view: ViewContainerRef) => {
      confirmModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>confirmModelService).modal, 'open');
        confirmModelService.openDialog(null, 1, viewRef);
        expect((<any>confirmModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
