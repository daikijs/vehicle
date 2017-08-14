import {
  async,
  TestBed
} from '@angular/core/testing';

import { AboutModule } from './about.module';

export function main() {
   describe('About component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AboutModule]
      });
    });

    it('should work',
      async(() => {
        expect(true).toEqual(true);
      }));
    });
}
