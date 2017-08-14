import {
  async,
  TestBed
} from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
declare var $: any;

import { DisplayWindowModalComponent }  from './display.modal.component';
import { ViewContainerRef }             from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay, DialogRef } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
   describe('Display modal component', () => {
    let fixture: any;
    let dmInstance: any;
    let mockDialog = {
      context: {
        displayData: 'hello'
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
          BootstrapModalModule
        ],
        providers: [
          ViewContainerRef,
          MODAL_PROVIDERS,
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ],
        declarations: [
          DisplayWindowModalComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DisplayWindowModalComponent);
        dmInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('loadData function should work',
      async(() => {
        dmInstance.loadData();
        fixture.detectChanges();
        expect($('.display-wrapper .display-body').html()).toEqual(mockDialog.context.displayData);
      }));

    it('gotoHome function should work',
      async(() => {
        dmInstance.gotoHome();
        expect((<any>dmInstance).router.navigate).toHaveBeenCalledWith(['/']);
      }));

  });
}
