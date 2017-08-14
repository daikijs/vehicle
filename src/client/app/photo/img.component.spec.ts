import {
  async,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { ImgComponent }           from './img.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }            from '../core/data.service';
import { EventService }           from '../core/event.service';
import { SpinnerService }         from '../shared/index';
import { StoreService }           from '../core/store.service';
import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { HttpModule }           from '@angular/http';
import { UploadModelService }  from './modal/upload.modal.service';
import { ShowImgModelService } from './modal/show.img.modal.service';

export function main() {
   describe('Image Location component', () => {
     let fixture: any;
     let imgInstance: ImgComponent;
     let mockDataService: any;
     let mockData =  {
      data: {
        desc: 'description',
        steps: {
          totalStep: 3,
          currentStep:1
        },
        liveHelp: {
          icon: 'icon.png',
          on: 1
        },
        ui: {
          logo: 'logo.jpg'
        },
        help: {
          icon: 'http://icons.com/icon.png',
          on: 1,
          link: 'http://link.com'
        },
        photos: [
          {
            required: true,
            id: '2121'
          }
        ]
      }
    };

    let mockShowImgModelService: any;
    let showIgmReturnData = {
      status: true,
      url: 'http://result.com'
    };

    let mockShowImgModelData = {
      result: Promise.resolve(showIgmReturnData)
    };

    beforeEach(async(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        imports: [
          HttpModule
        ],
        declarations: [
          ImgComponent
        ],
        providers: [
          DataService,
          EventService,
          SpinnerService,
          StoreService,
          UploadModelService,
          ShowImgModelService,
          MODAL_PROVIDERS,
          {
            provide: ActivatedRoute, useValue: {
              params: Observable.of({ id: 'id' })
            }
          },
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
          { provide: DataService, useValue: new MockDataService() },
          { provide: ShowImgModelService, useValue: new MockShowImgModelService() }
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ImgComponent);
        imgInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = mockData;

        mockShowImgModelService = fixture.debugElement.injector.get(ShowImgModelService) as MockShowImgModelService;
        spyOn(mockShowImgModelService, 'openDialog').and.callThrough();
        mockShowImgModelService.returnValue = mockShowImgModelData;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        imgInstance.ngOnInit();
        spyOn(imgInstance, 'checkNextStep');
        spyOn((<any>imgInstance)._eventService, 'emit');
        spyOn((<any>imgInstance).loadData, 'emit');
        fixture.detectChanges();
        expect(imgInstance.checkNextStep).toHaveBeenCalled();
        expect((<any>imgInstance)._eventService.emit).toHaveBeenCalled();
        expect(imgInstance.loadData.emit).toHaveBeenCalled();
      }));

    it('checkNextStep function should work',
      async(() => {
        imgInstance.checkNextStep();
        spyOn((<any>imgInstance).checkStep, 'emit');
        fixture.detectChanges();
        expect(imgInstance.checkStep.emit).toHaveBeenCalled();
      }));

    it('upload modal should be opened',
      fakeAsync(() => {
        imgInstance.ngOnInit();
        fixture.detectChanges();
        (imgInstance.imgList[0] as any)['uploaded'] = true;
        imgInstance.openUploadModal(0);
        fixture.detectChanges();
        expect((<any>imgInstance)._showImgModelService.openDialog).toHaveBeenCalled();
        tick();
        fixture.detectChanges();
        expect((imgInstance.imgList[0] as any)['uploadedImgUrl']).toEqual(showIgmReturnData['url']);
      }));
  });
}

class MockDataService {

  returnValue: Object;
  host = 'http://host.com';

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}

class MockShowImgModelService {
  returnValue: Object;

  openDialog(title:string='', imgUrl: string, postdata: any={}, viewContainer: any): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }
}
