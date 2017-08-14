import {
  async,
  TestBed,
  fakeAsync
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

import { GetVehicleModule }       from './get_vehicle.module';
import { GetVehicleComponent }    from './get_vehicle.component';

import { EventService }           from '../core/event.service';
import { SpinnerService }         from '../shared/index';
import { StoreService }           from '../core/store.service';
import { DataService }            from '../core/data.service';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
   describe('Get vehicle component', () => {
    const MODAL_PROVIDERS = [
      Modal,
      Overlay,
      { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
    ];
    let fixture: any;
    let getVehicleInstance: any;
    let mockDataService: any;
    let mockData =  {
      data: {
        years: {
          1: 1,
          2: 2,
          3: 3
        },
        steps: {
          totalStep: 3,
          currentStep: 1
        },
        liveHelp: {
          icon: 'http://icon.png'
        },
        help: {
          icon: 'http://icon.png'
        },
        ui: {
          logo: 'http://icon.png'
        },
        slug: 'slug'
      }
    };

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        imports: [
          GetVehicleModule,
          ModalModule.forRoot(),
          BootstrapModalModule
        ],
        providers: [
          MODAL_PROVIDERS,
          EventService,
          SpinnerService,
          StoreService,
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
        fixture = TestBed.createComponent(GetVehicleComponent);
        getVehicleInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        spyOn(mockDataService, 'get').and.callThrough();
        mockDataService.returnValue = mockData;
      });
    }));

    it('ngOnInit function should work',
      fakeAsync(() => {
        spyOn(getVehicleInstance, 'initVehicleData');
        fixture.detectChanges();
        expect(getVehicleInstance._dataService.get).toHaveBeenCalled();
        expect(getVehicleInstance._dataService.post).toHaveBeenCalled();
        expect(getVehicleInstance.initVehicleData).toHaveBeenCalled();
      }));

    it('initVehicleData function should work',
      async(() => {
        spyOn((<any>getVehicleInstance)._eventService, 'emit');
        getVehicleInstance.initVehicleData(mockData['data']);
        fixture.detectChanges();
        expect(getVehicleInstance._eventService.emit).toHaveBeenCalled();
      }));

    it('onChangeYear function should work',
      async(() => {
        getVehicleInstance.onChangeYear(-1);
        fixture.detectChanges();
        expect(getVehicleInstance.claimMakeDisabled).toEqual(true);
      }));

    it('onChangeMake function should work',
      async(() => {
        getVehicleInstance.onChangeMake(-1);
        fixture.detectChanges();
        expect(getVehicleInstance.claimCategoryDisabled).toEqual(true);
      }));

    it('onChangeModel function should work',
      async(() => {
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        let element = compiled.querySelector('select[name=claimModelID]');
        element.selectedValue = '-1';
        fixture.detectChanges();
        expect(getVehicleInstance.claimCategoryDisabled).toEqual(true);
      }));

    it('onChangeCategory function should work',
      async(() => {
        getVehicleInstance.onChangeCategory(1);
        fixture.detectChanges();
        expect(getVehicleInstance.claimCategoryID).toEqual(1);
      }));

    it('keypressVin function should work',
      async(() => {
        getVehicleInstance.keypressVin(23434354354342189);
        fixture.detectChanges();
        expect(getVehicleInstance.nextAvailable).toEqual(2);
      }));

    it('loadClaim function should work',
      async(() => {
        getVehicleInstance.loadClaim({
          value: 'value'
        });
        fixture.detectChanges();
        expect(getVehicleInstance.router.navigate).toHaveBeenCalledWith(['/damage', 'slug']);
        expect(getVehicleInstance._storeService.get('p_slug')).toEqual('slug');
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
