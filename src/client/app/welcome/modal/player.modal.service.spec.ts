import { inject, TestBed, async } from '@angular/core/testing';
import { PlayerModelService } from './player.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Player modal service', () => {
    let playerModelService: PlayerModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          PlayerModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ]
      }).compileComponents();
    });

    beforeEach(inject([PlayerModelService], (modalService: PlayerModelService, view: ViewContainerRef) => {
      playerModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>playerModelService).modal, 'open');
        playerModelService.openDialog('', viewRef);
        expect((<any>playerModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
