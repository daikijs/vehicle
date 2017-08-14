import {
  async,
  TestBed
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { ImageMapComponent }  from '../utilities/image-map/image-map.component';
import { DamageLocationComponent } from './damage-location.component';

export function main() {
   describe('Damage location component', () => {
    let fixture: any;
    let damageLocationInstance: any;

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        providers: [
          { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
        ],
        declarations:[
          ImageMapComponent,
          DamageLocationComponent

        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DamageLocationComponent);
        damageLocationInstance = fixture.debugElement.componentInstance;
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        let data = 'data';
        damageLocationInstance.damageLocationData = data;
        damageLocationInstance.ngOnInit();
        expect(damageLocationInstance.locationMapData).toEqual(data);
      }));

    it('clickOnImage function should work',
      async(() => {
        spyOn((<any>damageLocationInstance).getAnswerId, 'emit');
        damageLocationInstance.clickOnImage({});
        expect((<any>damageLocationInstance).getAnswerId.emit).toHaveBeenCalled();
      }));

    it('loadedImage function should work',
      async(() => {
        spyOn((<any>damageLocationInstance).loadImage, 'emit');
        damageLocationInstance.loadedImage();
        expect((<any>damageLocationInstance).loadImage.emit).toHaveBeenCalled();
      }));
  });
}
