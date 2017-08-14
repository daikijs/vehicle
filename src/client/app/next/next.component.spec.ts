import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
declare var $: any;

import { NextComponent }          from './next.component';
import { NextModule }             from './next.module';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }            from '../core/data.service';
import { EventService }           from '../core/event.service';
import { SpinnerService }         from '../shared/index';
import { StoreService }           from '../core/store.service';
import { NavbarService }          from '../core/navbar.service';

export function main() {
   describe('Next component', () => {
    let fixture: any;
    let nextInstance: any;
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
        },
        action: {
          btns: ['next']
        }
      },
      _body: 'Next component'
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          NextModule
        ],
        providers: [
          EventService,
          SpinnerService,
          StoreService,
          NavbarService,
          { provide: DataService, useValue: new MockDataService() },
          {
            provide: ActivatedRoute, useValue: {
              params: Observable.of({ slug: 'slug' })
            }
          },
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NextComponent);
        nextInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        mockDataServiceSpy = spyOn(mockDataService, 'post').and.callThrough();
        spyOn(mockDataService, 'get').and.callThrough();
        mockDataService.returnValue = mockData;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        spyOn((<any>nextInstance)._eventService, 'emit');
        spyOn((<any>nextInstance)._storeService, 'setObject');
        spyOn((<any>nextInstance)._navbarService, 'setData');
        nextInstance.ngOnInit();
        fixture.detectChanges();
        expect(nextInstance.slug).toEqual('slug');
        expect(nextInstance._eventService.emit).toHaveBeenCalled();
        expect(nextInstance._storeService.setObject).toHaveBeenCalled();
        expect(nextInstance._navbarService.setData).toHaveBeenCalled();
        expect(nextInstance._dataService.get).toHaveBeenCalled();
      }));

    it('data is displayed in next body element',
      async(() => {
        nextInstance.loading = true;
        nextInstance.renderNextBodyElement();
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        let bodyEle = compiled.querySelector('.next-wrapper .next-body');
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(bodyEle.innerHTML).toBe(nextInstance.estimateData);
        });
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

  get(url:string='', b: boolean): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
