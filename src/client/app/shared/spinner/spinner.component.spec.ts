import {
  async,
  TestBed
} from '@angular/core/testing';
declare let $: any;

import { SpinnerComponent } from './spinner.component';
import { SpinnerService }   from './spinner.service';

export function main() {
   describe('Spinner component', () => {
     let fixture: any;
     let spInstance: any;

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        declarations: [
          SpinnerComponent
        ],
        providers: [
          SpinnerService
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SpinnerComponent);
        spInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('ngOnChanges function should work',
      async(() => {
        spInstance.type = 0;
        spInstance.active = true;
        fixture.detectChanges();
        spInstance.ngOnInit();
        fixture.detectChanges();
        expect($('.loading-spinner').css('margin-left')).toEqual('-25px');
      }));
  });
}
