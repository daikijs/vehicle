import { inject, TestBed, async } from '@angular/core/testing';
import { ShowImgModelService } from './show.img.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Show image modal service', () => {
    let showImgModelService: ShowImgModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          ShowImgModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ]
      }).compileComponents();
    });

    beforeEach(inject([ShowImgModelService], (modalService: ShowImgModelService, view: ViewContainerRef) => {
      showImgModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>showImgModelService).modal, 'open');
        showImgModelService.openDialog('', '', null, viewRef);
        expect((<any>showImgModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
