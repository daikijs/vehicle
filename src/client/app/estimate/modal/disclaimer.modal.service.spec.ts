import { inject, TestBed, async } from '@angular/core/testing';
import { DisclaimerModelService } from './disclaimer.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Damage modal service', () => {
    let disclaimerModelService: DisclaimerModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          DisclaimerModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ]
      }).compileComponents();
    });

    beforeEach(inject([DisclaimerModelService], (modalService: DisclaimerModelService, view: ViewContainerRef) => {
      disclaimerModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>disclaimerModelService).modal, 'open');
        disclaimerModelService.openDialog('', viewRef);
        expect((<any>disclaimerModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
