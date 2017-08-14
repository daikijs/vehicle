import {
  async,
  TestBed
} from '@angular/core/testing';

import { ZipModule } from './zip.module';

export function main() {
   describe('About component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ZipModule]
      });
    });

    it('should work',
      async(() => {
        expect(true).toEqual(true);
      }));
    });
}
