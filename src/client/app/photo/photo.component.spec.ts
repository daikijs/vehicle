import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';

import { PhotoModule } from './photo.module';
import { ImgComponent } from './img.component';
import { PhotoComponent } from './photo.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }            from '../core/data.service';
import { EventService }           from '../core/event.service';
import { SpinnerService }         from '../shared/index';
import { StoreService }           from '../core/store.service';
import { HttpModule } from '@angular/http';
import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

export function main() {
   describe('Photo component', () => {
     let fixture: any;
     let photoInstance: any;
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
          on: 1,
          link: 'http://link.com'
        },
        photos: [
          {
            required: true
          }
        ]
      }
    };

    beforeEach(async(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        imports: [
          PhotoModule,
          HttpModule
        ],
        providers: [
          EventService,
          SpinnerService,
          StoreService,
          MODAL_PROVIDERS,
          {
            provide: ActivatedRoute, useValue: {
              params: Observable.of({ id: 'id' })
            }
          },
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
          { provide: DataService, useValue: new MockDataService() }
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PhotoComponent);
        photoInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = mockData;
        imgInstance = fixture.debugElement.query(By.directive(ImgComponent)).componentInstance;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        photoInstance.ngOnInit();
        expect(photoInstance.slugId).toEqual('id');
      }));

    it('image-location getData is called',
      async((done: any) => {
        imgInstance.loadData.emit({
          totalStep: 3,
          currentStep:1
        });

        expect(photoInstance.isLoading).toEqual(true);
      }));

    it('image-location getStepStatus is called',
      async(() => {
        imgInstance.checkStep.emit(true);
        expect(photoInstance.isNext).toEqual(true);
        imgInstance.checkStep.emit(false);
        expect(photoInstance.isNext).toEqual(false);
      }));

    it('next function should work',
      async(() => {
        let slugId = 'slugId';
        photoInstance.isNext = true;
        photoInstance.slugId = slugId;
        photoInstance.next();
        expect(photoInstance.router.navigate).toHaveBeenCalledWith(['/estimate', slugId]);
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
