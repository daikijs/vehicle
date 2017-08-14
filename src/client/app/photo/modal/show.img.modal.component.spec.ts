import {
  async,
  TestBed
} from '@angular/core/testing';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { DialogRef } from 'angular2-modal';

import { ShowImgWindowModalComponent } from './show.img.modal.component';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

export function main() {
   describe('Show Image Modal component', () => {
    let fixture: any;
    let showImgModalInstance: any;
    let mockDialog = {
       context: {
        imgURL: 'http://imgurl.com',
        title: 'title'
      },
      close: function(data: Object) {
        return data;
      }
    };

    beforeEach(async(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: DialogRef, useValue: mockDialog },
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          ModalModule.forRoot(),
          FileUploadModule
        ],
        providers: [
          MODAL_PROVIDERS,
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ],
        declarations: [
          ShowImgWindowModalComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ShowImgWindowModalComponent);
        showImgModalInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        showImgModalInstance.ngOnInit();
        fixture.detectChanges();
        expect(showImgModalInstance.imgURL).toEqual(mockDialog['context']['imgURL']);
      }));

    it('onClose function should work',
      async(() => {
        spyOn(showImgModalInstance.dialog, 'close');
        showImgModalInstance.onClose();
        fixture.detectChanges();
        expect(showImgModalInstance.dialog.close).toHaveBeenCalled();
      }));

    it('onCancel function should work',
      async(() => {
        spyOn(showImgModalInstance.dialog, 'close');
        showImgModalInstance.onClose();
        fixture.detectChanges();
        expect(showImgModalInstance.dialog.close).toHaveBeenCalled();
      }));
  });
}
