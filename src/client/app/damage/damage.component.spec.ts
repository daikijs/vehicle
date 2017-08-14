import {
  async,
  TestBed
} from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService }  from '../core/data.service';
import { StoreService }  from '../core/store.service';

import { DamageModule } from './damage.module';
import { DamageComponent } from './damage.component';

import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal, BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

export function main() {
   describe('Damage component', () => {
    let fixture: any;
    let damageInstance: any;
    let mockDataService: any;
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
          DamageModule,
          ModalModule.forRoot(),
          BootstrapModalModule
        ],
        providers: [
          StoreService,
          MODAL_PROVIDERS,
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
        fixture = TestBed.createComponent(DamageComponent);
        damageInstance = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = mockData;
      });
    }));

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('ngOnInit function should work',
      async(() => {
        damageInstance.ngOnInit();
        expect(damageInstance.slug).toEqual('id');
      }));

    it('checkNextAbility function should work',
      async(() => {
        damageInstance.checkNextAbility(true);
        expect(damageInstance.boolNextAbility).toEqual(true);
      }));

    it('next navigate function should work',
      async(() => {
        let slugId = 'id';
        damageInstance.slug = slugId;
        damageInstance.next();
        expect(damageInstance.router.navigate).toHaveBeenCalledWith(['/photo', slugId]);
      }));

    it('getData function should work',
      async(() => {
        damageInstance.getData({
          totalStep: 3,
          currentStep: 1
        });
        expect(damageInstance.totoalStep).toEqual(3);
        expect(damageInstance.currentStep).toEqual(1);
        expect(damageInstance.isLoading).toEqual(true);
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
