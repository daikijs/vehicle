import {
  async,
  TestBed,
  inject
} from '@angular/core/testing';
import { SpinnerService } from './spinner.service';

export function main() {
   describe('Store service', () => {

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        providers: [
          SpinnerService
        ]
      }).compileComponents();
    }));

    it('set_active function should work', inject([SpinnerService], (spinnerService: SpinnerService) => {
      spyOn((<any>spinnerService).status, 'next');
      spinnerService.set_active(true, 1);
      expect((<any>spinnerService).status.next).toHaveBeenCalled();
    }));
  });
}
