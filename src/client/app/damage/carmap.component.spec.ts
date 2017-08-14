import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  HttpModule
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Router }              from '@angular/router';
import { DataService }         from '../core/data.service';
import { DamageModelService }  from './modal/damage.modal.service';
import { EventService }        from '../core/event.service';
import { ImageMapComponent }   from '../utilities/image-map/image-map.component';
import { ConfirmModelService } from './modal/confirm.modal.service';

import { CarMapComponent }  from './carmap.component';
import { ViewContainerRef } from '@angular/core';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
   describe('Carmap component', () => {
    let fixture: any;
    let carmapInstance: any;
    let mockDataService: any;
    let mockConfirmModalService: any;
    let mockDamageModelService: any;
    let originalTimeout: number;
    let mockData =  {
      data: {
        help: {
          icon: 'http://icon.png',
          on: 1,
          link: 'http://link.com'
        },
        liveHelp: {
          icon: 'http://icon.png',
          on: 1
        },
        steps: {
          totalStep: 3,
          currentStep: 1
        },
        ui: {
          logo: 'http://logo.png'
        }
      }
    };

    let mockModalData = {
      result: Promise.resolve(true)
    };

    beforeEach(async(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          ModalModule.forRoot(),
          BootstrapModalModule
        ],
        providers: [
          ViewContainerRef,
          MODAL_PROVIDERS,
          EventService,
          { provide: DataService, useValue: new MockDataService() },
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
          { provide: DamageModelService, useValue: new MockDamageModelService() },
          { provide: ConfirmModelService, useValue: new MockConfirmModalService() }
        ],
        declarations: [
          CarMapComponent,
          ImageMapComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CarMapComponent);
        carmapInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = mockData;

        mockDamageModelService = fixture.debugElement.injector.get(DamageModelService) as MockDamageModelService;
        spyOn(mockDamageModelService, 'openDialog').and.callThrough();
        mockDamageModelService.returnValue = mockModalData;

        mockConfirmModalService = fixture.debugElement.injector.get(ConfirmModelService) as MockConfirmModalService;
        spyOn(mockConfirmModalService, 'openDialog').and.callThrough();
        mockConfirmModalService.returnValue = mockModalData;
      });
    }));

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('ngOnInit function should work',
      async(() => {
        spyOn(carmapInstance, 'setData');
        carmapInstance.ngOnInit();
        expect(carmapInstance.setData).toHaveBeenCalled();
      }));

    it('setData function should work',
      async(() => {
        spyOn((<any>carmapInstance)._eventService, 'emit');
        spyOn((<any>carmapInstance).loadData, 'emit');
        carmapInstance.ngOnInit();
        carmapInstance.setData(mockData);
        expect(carmapInstance.carImgLaod).toEqual(true);
        expect((<any>carmapInstance)._eventService.emit).toHaveBeenCalled();
        expect((<any>carmapInstance).loadData.emit).toHaveBeenCalled();
      }));

    it('insertMarkToList function should work',
      async(() => {
        carmapInstance.markList = [
          {
            id: 1
          },
          {
            id: 2
          }
        ];
        let index = carmapInstance.insertMarkToList({id: 1});
        expect(index).toEqual(0);
      }));

    it('clickOnImage function should work',
      async(() => {
        carmapInstance.markList = [
          {
            id: 1
          },
          {
            id: 2
          }
        ];
        carmapInstance.clickOnImage({
          id: 1,
          value: 1,
          AutoPartID: 1
        });
        expect((<any>carmapInstance)._confirmModelService.openDialog).toHaveBeenCalled();
      }));

    it('doneAutoPart function should work',
      async(() => {
        carmapInstance.carImgLaod = true;
        spyOn((<any>carmapInstance).checkBookMark, 'emit');
        carmapInstance.markList = [
          {
            id: 1
          },
          {
            id: 2
          }
        ];
        carmapInstance.doneAutoPart();
        expect(carmapInstance.checkBookMark.emit).toHaveBeenCalled();
      }));
  });
}

class MockDataService {

  returnValue: Object;

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}

class MockDamageModelService {
  returnValue: Object;

  openDialog(autoPartID: number, carMap:any, viewContainer: any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }
}

class MockConfirmModalService {
  returnValue: Object;

  openDialog(carmapHandler: any, markId: number, viewContainer: any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }
}
