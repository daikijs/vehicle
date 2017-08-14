import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  RouterTestingModule
} from '@angular/router/testing';

import { MoreModule } from './more.module';
import { MoreComponent } from './more.component';
import { Observable } from 'rxjs/Rx';
import { Router, NavigationStart, Route } from '@angular/router';
import { StoreService }      from '../core/store.service';
import { EventService }      from '../core/event.service';
import { APP_BASE_HREF } from '@angular/common';

export function main() {
  describe('More component', () => {
    let fixture: any;
    let moreInstance: any;
    let config: Route[] = [
      {
        path: 'more/:slug',
        component: MoreComponent
      }
    ];

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          MoreModule,
          RouterTestingModule.withRoutes(config)
        ],
        providers: [
          StoreService,
          EventService,
          {
            provide: Router, useClass: MockRouter
          },
          { provide: APP_BASE_HREF, useValue: '/' }
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MoreComponent);
        moreInstance = fixture.debugElement.componentInstance;
        moreInstance.ngOnInit();
      });
    }));

    it('router event should work',
      async(() => {
        let initSpy = spyOn(moreInstance, 'init');
        fixture.detectChanges();
        expect(initSpy).toHaveBeenCalled();
      }));

    it('init function should work',
      async(() => {
        let moreSpy = spyOn(moreInstance._storeService, 'get');
        fixture.detectChanges();
        expect(moreSpy).toHaveBeenCalled();
      }));

    it('event service should be called',
      async(() => {
        let moreEventSpy = spyOn(moreInstance._eventService, 'emit');
        moreInstance._storeService.setObject('load_topbar_data',{data: 'data'});
        fixture.detectChanges();
        expect(moreEventSpy).toHaveBeenCalled();
      }));
  });
}

class MockRouter {
  public ne = new NavigationStart(0, 'http://localhost:404/more/11');
  events = new Observable((observer: any) => {
    observer.next(this.ne);
    observer.complete();
  });
}
