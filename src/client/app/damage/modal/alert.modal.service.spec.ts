import { inject, TestBed, async } from '@angular/core/testing';
import { AlertModelService } from './alert.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Alert modal service', () => {
    let alertModelService: AlertModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          AlertModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ]
      }).compileComponents();
    });

    beforeEach(inject([AlertModelService], (modalService: AlertModelService, view: ViewContainerRef) => {
      alertModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>alertModelService).modal, 'open').and.returnValue(
          Promise.resolve(1)
        );
        alertModelService.openDialog('', viewRef);
        expect((<any>alertModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
