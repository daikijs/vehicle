import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { VehicleComponent }       from './vehicle.component';
import { VehicleModule }          from './vehicle.module';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }            from '../core/data.service';
import { EventService }           from '../core/event.service';
import { SpinnerService }         from '../shared/index';

export function main() {
   describe('Vehicle component', () => {
    let fixture: any;
    let vehicleInstance: any;
    let mockDataService: any;
    let mockDataServiceSpy: any;
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
        }
      }
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          VehicleModule
        ],
        providers: [
          EventService,
          SpinnerService,
          { provide: DataService, useValue: new MockDataService() },
          {
            provide: ActivatedRoute, useValue: {
              params: Observable.of({ id: 'id' })
            }
          },
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(VehicleComponent);
        vehicleInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        mockDataServiceSpy = spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = mockData;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        spyOn(vehicleInstance, 'initVehicleData');
        spyOn(vehicleInstance, 'redirectWithPermissionIssue');
        vehicleInstance.ngOnInit();
        expect(vehicleInstance.bCheckPermission).toEqual(true);
        expect(vehicleInstance.initVehicleData).toHaveBeenCalled();
        expect(vehicleInstance.redirectWithPermissionIssue).toHaveBeenCalled();
      }));

    it('redirectWithPermissionIssue function should work',
      async(() => {
        vehicleInstance.vehicleData = {
          message: vehicleInstance.PEMISSIONDENIED
        };

        vehicleInstance.redirectWithPermissionIssue();
        fixture.detectChanges();
        expect(vehicleInstance.router.navigate).toHaveBeenCalledWith(['/']);
      }));

    it('initVehicleData function should work',
      async(() => {
        let eventServiceSpy = spyOn((<any>vehicleInstance)._eventService, 'emit');
        vehicleInstance.initVehicleData(mockData['data']);
        fixture.detectChanges();
        expect(vehicleInstance.helpStatus).toEqual(true);
        expect(vehicleInstance.liveHelpStatus).toEqual(true);
        expect(vehicleInstance.isPageLoading).toEqual(true);
        expect(eventServiceSpy).toHaveBeenCalled();
      }));

    it('next function should be called by the "next" button',
      async(() => {
        vehicleInstance.bCheckPermission = true;
        let compiled = fixture.debugElement.nativeElement;
        spyOn(vehicleInstance, 'next');
        fixture.detectChanges();
        compiled.querySelector('.blue-btn-wrapper a.main-btn').click();
        fixture.detectChanges();
        expect(vehicleInstance.next).toHaveBeenCalled();
      }));

    it('next function should work',
      async(() => {
        vehicleInstance.slug = 'slug';
        let spinnerSpy = spyOn((<any>vehicleInstance)._spinner, 'stop');
        vehicleInstance.next();
        fixture.detectChanges();
        expect(vehicleInstance.router.navigate).toHaveBeenCalledWith(['/damage', 'slug']);
        expect(spinnerSpy).toHaveBeenCalled();
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
