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
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { WelcomeComponent } from './welcome.component';
import { WelcomeModule } from './welcome.module';
import { DataService }   from '../core/data.service';
import { SpinnerService }  from '../shared/index';
import { PlayerModelService } from './modal/player.modal.service';

import { OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

export function main() {

  describe('Welcome component', () => {
    let description = 'Hello';
    let fixture: any;
    let welcomeInstance: any;
    let mockDataService: any;
    let mockDataServiceSpy: any;

    const createComponent = () => {
      fixture = TestBed.createComponent(WelcomeComponent);

      welcomeInstance = fixture.debugElement.componentInstance;
      mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
      mockDataServiceSpy = spyOn(mockDataService, 'post').and.callThrough();
      mockDataService.returnValue = {
        data: {
          desc: description
        }
      };
    };

    beforeEach(async(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          WelcomeModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          SpinnerService,
          PlayerModelService,
          MODAL_PROVIDERS,
          BaseRequestOptions,
          MockBackend,
          {
            provide: Http, useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          { provide: DataService, useValue: new MockDataService() }
        ]
      }).compileComponents();
    }));

    it('should navigate the next page by clicking',
      async(() => {
        createComponent();
        let navigateSpy = spyOn((<any>welcomeInstance)._router, 'navigate');
        welcomeInstance.slugId = 'id';
        welcomeInstance.callback = 'vehicle';
        welcomeInstance.start();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/vehicle', 'id']);
      }));

    it('should show the player modal',
      async(() => {
        createComponent();
        let navigateSpy = spyOn((<any>welcomeInstance)._playerModal, 'openDialog');
        welcomeInstance.player();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalled();
      }));

    it('should get the data from welcome api',
      async(() => {
        createComponent();
        welcomeInstance.slugId = 'slugid';
        welcomeInstance.getWelcomeData();
        fixture.detectChanges();
        expect(welcomeInstance._dataService).toEqual(jasmine.any(MockDataService));
        expect(welcomeInstance.welcomeDescription).toEqual(description);

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
