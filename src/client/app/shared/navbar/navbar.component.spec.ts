import {
  async,
  TestBed
} from '@angular/core/testing';
import { Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { NavbarComponent }         from './navbar.component';

import { NavbarService }           from '../../core/navbar.service';
import { StoreService }            from '../../core/store.service';

export function main() {
   describe('Navbar component', () => {
     let fixture: any;
     let nbInstance: any;

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        declarations: [
          NavbarComponent
        ],
        providers: [
          NavbarService,
          StoreService,
          {
            provide: Router, useClass: RouterStub
          }
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        nbInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        let btns = [
          {
            text: 'start'
          },
          {
            text: 'cancel'
          }
        ];
        nbInstance.ngOnInit();
        (<any>nbInstance)._navbarService.setData(btns);
        expect(nbInstance.actionVisible).toEqual(true);
      }));

    it('moreAction function should work',
      async(() => {
        nbInstance.slug = 'slug';
        spyOn((<any>nbInstance).router, 'navigate');
        nbInstance.moreAction('http://link.com', 'hello', 0);
        expect((<any>nbInstance).router.navigate).toHaveBeenCalledWith(['/more', 'slug']);
      }));
  });
}

class RouterStub {
  public url: string;
  private subject = new Subject();
  private events = this.subject.asObservable();

  navigate(url: string) {
    this.url = url;
    this.triggerNavEvents(url);
  }

  triggerNavEvents(url: string) {
    let ne = new NavigationStart(0, url);
    this.subject.next(ne);
  }
}
