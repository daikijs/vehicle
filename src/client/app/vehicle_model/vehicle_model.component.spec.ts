import {
  async,
  TestBed
} from '@angular/core/testing';

import { VehicleModelModule } from './vehicle_model.module';

export function main() {
   describe('About component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [VehicleModelModule]
      });
    });

    it('should work',
      async(() => {
        expect(true).toEqual(true);
      }));
    });
}
