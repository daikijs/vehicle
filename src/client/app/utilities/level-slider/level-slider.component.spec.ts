import {
  async,
  TestBed
} from '@angular/core/testing';

import { LevelSliderComponent } from './level-slider.component';

export function main() {
   describe('Level Slider component', () => {
     let fixture: any;
     let lsInstance: any;

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        declarations: [
          LevelSliderComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LevelSliderComponent);
        lsInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('makeLevelBar and ngOnChanges function should work',
      async(() => {
        lsInstance.max = 3;
        lsInstance.min = 1;

        lsInstance.makeLevelBar();
        expect(lsInstance.colors.length).toEqual(4);
        expect(lsInstance.gradients.length).toEqual(3);
        expect(lsInstance.isLoading).toEqual(true);
      }));
  });
}
