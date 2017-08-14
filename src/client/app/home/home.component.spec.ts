import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http, HttpModule
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';

import { HomeComponent } from './home.component';
import { HomeModule } from './home.module';
import { DataService }  from '../core/data.service';
import { StoreService }  from '../core/store.service';
import { SpinnerService }  from '../shared/index';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';

export function main() {
  describe('Home component', () => {
    let fixture: any;
    let homeInstance: any;
    let mockDataService: any;
    let mockDataServiceSpy: any;

    const createComponent = () => {
      fixture = TestBed.createComponent(HomeComponent);
      homeInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      mockDataServiceSpy = spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = {
        data: {
          slug: 'sulgId'
        }
      };
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          HttpModule,
          HomeModule
        ],
        providers: [
          StoreService,
          SpinnerService,
          RouterTestingModule,
          BaseRequestOptions,
          MockBackend,
          {provide: Http, useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          {
            provide: ActivatedRoute, useValue: {
              params: Observable.of({ profile_slug: 'profile_slug' })
            }
          },
          {
            provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); }
          },
          { provide: DataService, useValue: new MockDataService() }
        ]
      }).compileComponents();
    }));

    it('should call next when submitted',
      async(() => {
        createComponent();
        spyOn(fixture.componentInstance, 'next');

        let compiled = fixture.debugElement.nativeElement;
        compiled.querySelector('form.contact-form input[name="claimID"]').value = 'claimid';
        compiled.querySelector('form.contact-form input[name="profile_slug"]').value = 'sulgId';
        compiled.querySelector('form.contact-form a').click();
        fixture.detectChanges();

        expect(homeInstance.next).toHaveBeenCalled();
        expect(homeInstance._dataService).toEqual(jasmine.any(MockDataService));
      }));

    it('next function should work',
      async(() => {
        createComponent();
        let slugId = 'sulgId';
        homeInstance.next({
          value: {
            claimID: '112',
            profile_slug: slugId
          }
        });
        fixture.detectChanges();

        expect(homeInstance._dataService).toEqual(jasmine.any(MockDataService));
        expect(homeInstance._storeService.get('p_slug')).toEqual(slugId);
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
