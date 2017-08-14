import {
  async,
  TestBed,
  inject
} from '@angular/core/testing';
import { NavbarService } from './navbar.service';

export function main() {
  describe('Navbar service', () => {
    let navbarService: NavbarService = null;
    let btns = ['start', 'cancel'];

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          NavbarService
        ]
      }).compileComponents();
    });

    beforeEach(inject([NavbarService], (nav: NavbarService) => {
      navbarService = nav;
    }));

    it('setData function should work', () => {
      spyOn((<any>navbarService).subject, 'next');
      navbarService.setData(btns);
      expect((<any>navbarService).subject.next).toHaveBeenCalled();
    });

    it('getEvent should handle navbar service',
      async(() => {
        let navbarSubject: NavbarService = TestBed.get(NavbarService);
        navbarService.setData(btns);
        navbarSubject.getEvent().subscribe((state: any) => {
          expect(state).toEqual(btns);
        });
      }));
  });
}
