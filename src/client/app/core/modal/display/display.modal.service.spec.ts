import { inject, TestBed, async } from '@angular/core/testing';
import { DisplayModelService } from './display.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Display modal service', () => {
    let displayModelService: DisplayModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          DisplayModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ],
      }).compileComponents();
    });

    beforeEach(inject([DisplayModelService], (modalService: DisplayModelService, view: ViewContainerRef) => {
      displayModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>displayModelService).modal, 'open');
        displayModelService.openDialog('', viewRef);
        expect((<any>displayModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
