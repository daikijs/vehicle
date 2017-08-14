import {
  async,
  TestBed,
  inject
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DisclaimerComponent } from './disclaimer.component';
import { DisclaimerModule } from './disclaimer.module';
import { SpinnerService }  from '../shared/index';

export function main() {
  describe('Disclaimer component', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          DisclaimerModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          SpinnerService
        ]
      }).compileComponents();
    }));

    it('should navigate to estimate page',
      async(inject([Router], (router: Router) => {
        let fixture = TestBed.createComponent(DisclaimerComponent);
        let component = fixture.componentInstance;
        let navigateSpy = spyOn((<any>component).router, 'navigate');
        component.slugId = 'id';
        component.next();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/estimate', 'id']);
    })));
  });
}
