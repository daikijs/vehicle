import { Component,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnInit } from '@angular/core';
import { CoordiateModel, CanvasStyleModel }  from '../core/model';
import { ImageMapComponent }  from '../utilities/image-map/image-map.component';

/**
 * This class represents the lazy loaded CarMapComponent.
 */

@Component({
  moduleId: module.id,
  selector: 'damage-location',
  templateUrl: 'damage-location.component.html',
  styleUrls: ['damage-location.component.css']
})

export class DamageLocationComponent implements OnInit {
  @ViewChild(ImageMapComponent) myImgMapHandler: ImageMapComponent;
  @Input() damageLocationData: Object;
  @Output() getAnswerId = new EventEmitter();
  @Output() loadImage = new EventEmitter();
  locationMapData: Object;
  locationMapProperties: CoordiateModel;
  locationMapStyle: CanvasStyleModel;
  locationLoading: boolean;

  ngOnInit() {
    this.locationMapData = this.damageLocationData;
    this.locationMapProperties = new CoordiateModel();
    this.locationMapProperties.x = 270;
    this.locationMapProperties.y = 257;
    this.locationLoading = true;
    this.locationMapStyle = new CanvasStyleModel();
    this.locationMapStyle.bgColor = 'blue';
    this.locationMapStyle.bgOpacity = 0.75;
    this.locationMapStyle.borderColor = 'black';
    this.locationMapStyle.borderWidth = 2;
    this.locationMapStyle.bgOverColor = 'blue';
    this.locationMapStyle.bgOverOpacity = 0.5;
    this.locationMapStyle.borderOverColor = 'black';
    this.locationMapStyle.borderOverWidth = 2;
  }

  /*
  click event on canvas
  */
  clickOnImage($event: any) {
    let value = ($event as any).value;
    let id = ($event as any).id;
    this.getAnswerId.emit({
      answer: value,
      id: id
    });
  }

  /*
  delete the select location
  */
  updateLocation(locationList: any[]) {
    this.myImgMapHandler.updatePolygon(locationList);
  }

  loadedImage() {
    this.loadImage.emit();
  }
}
