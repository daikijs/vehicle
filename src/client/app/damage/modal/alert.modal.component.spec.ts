import {
  async,
  TestBed
} from '@angular/core/testing';
import { OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef, ModalModule } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
declare var $: any;

import { AlertWindowModalComponent } from './alert.modal.component';
import { StoreService }  from '../../core/store.service';
import { Router } from '@angular/router';

export function main() {
   describe('Alert Modal component', () => {
    let fixture: any;
    let alertWindowModalComponent: any;
    let mockDialog = {
      context: {
        claimID: 12
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
          ModalModule.forRoot()
        ],
        providers: [
          MODAL_PROVIDERS,
          StoreService,
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ],
        declarations: [
          AlertWindowModalComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AlertWindowModalComponent);
        alertWindowModalComponent = fixture.debugElement.componentInstance;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        spyOn(alertWindowModalComponent, 'initStyle');
        alertWindowModalComponent.ngOnInit();
        expect(alertWindowModalComponent.initStyle).toHaveBeenCalled();
      }));

    it('initStyle function should work',
      async(() => {
        alertWindowModalComponent.initStyle();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(alertWindowModalComponent.circleImgLeft).toBeDefined();
        });
      }));

    it('next function should work',
      async(() => {
        let slugId = 'slugId';
        alertWindowModalComponent.slug = slugId;
        spyOn((<any>alertWindowModalComponent).dialog, 'close');
        alertWindowModalComponent.next();
        expect(alertWindowModalComponent.dialog.close).toHaveBeenCalled();
        expect(alertWindowModalComponent.router.navigate).toHaveBeenCalledWith(['/photo', slugId]);
      }));

    it('onCancel function should work',
      async(() => {
        spyOn((<any>alertWindowModalComponent).dialog, 'close');
        alertWindowModalComponent.onCancel();
        expect(alertWindowModalComponent.dialog.close).toHaveBeenCalled();
      }));
  });
}
