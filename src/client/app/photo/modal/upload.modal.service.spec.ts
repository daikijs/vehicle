import { inject, TestBed, async } from '@angular/core/testing';
import { UploadModelService } from './upload.modal.service';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
  describe('Upload modal service', () => {
    let uploadModelService: UploadModelService = null;
    let viewRef: any;

    beforeEach(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        providers: [
          UploadModelService,
          MODAL_PROVIDERS
        ],
        imports: [
          ModalModule.forRoot(),
          BootstrapModalModule
        ]
      }).compileComponents();
    });

    beforeEach(inject([UploadModelService], (modalService: UploadModelService, view: ViewContainerRef) => {
      uploadModelService = modalService;
      viewRef = view;
    }));

    it('openDialog function should work',
      async(() => {
        spyOn((<any>uploadModelService).modal, 'open');
        uploadModelService.openDialog([], 0, null, viewRef);
        expect((<any>uploadModelService).modal.open).toHaveBeenCalled();
      }));
  });
}
