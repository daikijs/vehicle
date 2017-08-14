import {
  async,
  TestBed
} from '@angular/core/testing';

import { DotSliderModule } from './dot-slider.module';
import { DotSliderComponent } from './dot-slider.component';

export function main() {
   describe('Photo component', () => {
     let fixture: any;
     let dsInstance: any;

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        imports: [
          DotSliderModule
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DotSliderComponent);
        dsInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('ngOnInit and ngOnChanges function should work',
      async(() => {
        spyOn(dsInstance, 'initSlider');
        dsInstance.sliderCount = 3;
        dsInstance.currentSliderCounter = 1;
        dsInstance.ngOnInit();
        expect(dsInstance.initSlider).toHaveBeenCalled();

        dsInstance.ngOnChanges();
        expect(dsInstance.initSlider).toHaveBeenCalled();
      }));

    it('initSlider function should work',
      async(() => {
        dsInstance.initSlider(3, 1);
        expect(dsInstance.sliderCounters.length).not.toEqual(0);
      }));
  });
}
