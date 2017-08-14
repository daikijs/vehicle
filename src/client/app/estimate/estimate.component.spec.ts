import {
  async,
  TestBed,
  fakeAsync
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

import { EstimateModule } from './estimate.module';
import { EstimateComponent } from './estimate.component';

import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { DataService }            from '../core/data.service';
import { StoreService }           from '../core/store.service';
import { EventService }           from '../core/event.service';
import { NavbarService }          from '../core/navbar.service';
import { SpinnerService }         from '../shared/index';
import { DisclaimerModelService } from './modal/disclaimer.modal.service';

export function main() {
  describe('Estimate component', () => {
    let fixture: any;
    let estimateInstance: any;
    let mockDataService: any;
    let mockData =  {
      data: {
        steps: [1,2,3],
        help: {
          icon: 'http://icon.png',
          on: 1,
          link: 'http://link.com'
        },
        liveHelp: {
          icon: 'http://icon.png',
          on: 1
        },
        estimateHtml: '',
        showDisclaimer: true,
        disclaimer: '',
        ui: {
          logo: 'http://icon.png'
        }
      },
      _body: ''
    };

    beforeEach(async(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        imports: [
          EstimateModule
        ],
        providers: [
          EventService,
          SpinnerService,
          StoreService,
          DisclaimerModelService,
          MODAL_PROVIDERS,
          NavbarService,
          {
            provide: ActivatedRoute, useValue: {
              params: Observable.of({ id: 'id' })
            }
          },
          { provide: DataService, useValue: new MockDataService() },
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EstimateComponent);
        estimateInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        spyOn(mockDataService, 'get').and.callThrough();
        mockDataService.returnValue = mockData;
      });
    }));

    it('ngOnInit function should work',
      fakeAsync(() => {
        spyOn((<any>estimateInstance)._eventService, 'emit');
        spyOn((<any>estimateInstance)._disclaimerModal, 'openDialog');
        spyOn(estimateInstance, 'init');
        estimateInstance.ngOnInit();
        fixture.detectChanges();
        expect(estimateInstance.slug).toEqual('id');
        expect(estimateInstance._eventService.emit).toHaveBeenCalled();
        expect(estimateInstance.init).toHaveBeenCalled();
        expect(estimateInstance.loading).toEqual(true);
        expect(estimateInstance._disclaimerModal.openDialog).toHaveBeenCalled();
      }));

    it('next function should work',
      async(() => {
        estimateInstance.slug = 'id';
        estimateInstance.next();
        expect(estimateInstance._router.navigate).toHaveBeenCalledWith(['/next', 'id']);
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

  get(url:string=''): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
