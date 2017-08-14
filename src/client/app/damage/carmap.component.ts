import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  OnInit,
  Renderer,
  EventEmitter,
  ViewContainerRef } from '@angular/core';

import { CoordiateModel ,
  CanvasStyleModel }  from '../core/model';

import { Config }              from '../shared/index';
import { Router }              from '@angular/router';
import { DataService }         from '../core/data.service';
import { DamageModelService }  from './modal/damage.modal.service';
import { EventService }        from '../core/event.service';
import { ImageMapComponent }   from '../utilities/image-map/image-map.component';
import { ConfirmModelService } from './modal/confirm.modal.service';
declare var $: any;

/**
 * This class represents the lazy loaded CarMapComponent.
 */

@Component({
  moduleId: module.id,
  selector: 'car-map',
  templateUrl: 'carmap.component.html',
  styleUrls: ['carmap.component.css']
})

export class CarMapComponent implements OnInit {
  @ViewChild(ImageMapComponent) carImgMap:ImageMapComponent;
  @Output() checkBookMark = new EventEmitter();
  @Output() loadData = new EventEmitter();
  @Input('slug') slug: string;

  backendApi: string;
  carMapData: Object;
  carMapProperties: CoordiateModel;
  carMapStyle: CanvasStyleModel;
  carImgLaod: boolean;
  markList: any[];

  constructor(
    private el: ElementRef,
    private router: Router,
    private renderer: Renderer,
    private _dataService: DataService,
    private _eventService: EventService,
    private _viewContainer: ViewContainerRef,
    private _damageModelService: DamageModelService,
    private _confirmModelService: ConfirmModelService
  ) {
    this.backendApi = Config.API;
  }

  ngOnInit() {
    this.carImgLaod = false;
    this.carMapProperties = new CoordiateModel();
    this.carMapProperties.x = 0;
    this.carMapProperties.y = 0;
    this.carMapStyle = new CanvasStyleModel();
    this.carMapStyle.bgColor = 'red';
    this.carMapStyle.bgOpacity = 0.6;
    this.carMapStyle.borderColor = 'black';
    this.carMapStyle.borderWidth = 1;
    this.carMapStyle.bgOverColor = 'blue';
    this.carMapStyle.bgOverOpacity = 0.6;
    this.carMapStyle.borderOverColor = 'black';
    this.carMapStyle.borderOverWidth = 1;

    let postData = {
      code: 200,
      data: {
        slug: this.slug
      }
    };

    this._dataService.post('v1/data/birdseyeauto', postData)
      .subscribe((res: any) => {
        this.setData(res);
      }, (error: any) => console.error('Unable to fetch brands', error));
  }

  /*
  set backend data to local variables
  */
  setData(res: any) {
    this.carMapData = res;
    let data = res.data;
    let helpIcon = this.backendApi + data.help.icon;
    let liveHelpIcon = this.backendApi + data.liveHelp.icon;
    let logoIcon = this.backendApi + data.ui.logo;
    let helpStatus: boolean, liveHelpStatus: boolean;
    if(data.liveHelp.on === 1) {
      liveHelpStatus = true;
    } else {
      liveHelpStatus = false;
    }

    if(data.help.on === 1) {
      helpStatus = true;
    } else {
      helpStatus = false;
    }

    this._eventService.emit('load_topbar_data', {
      helpIcon: helpIcon,
      helpStatus: helpStatus,
      liveHelpIcon: liveHelpIcon,
      liveHelpStatus: liveHelpStatus,
      logoIcon: logoIcon,
      helpLink: data.help.link
    });

    this.loadData.emit({
      totalStep: data.steps.totalStep,
      currentStep: data.steps.currentStep
    });

    let windowH = $(window).height();
    let windowW = $(window).width();
    let birdeyeSW = ((this.carMapData as any).data as any).width;
    let birdeyeSH = ((this.carMapData as any).data as any).height;
    let birdeyePadding = parseInt($('#birdeye_area').css('padding-top')) * 2;
    if((birdeyeSW + birdeyePadding) > windowW) {
      this.carMapProperties.x = $('#birdeye_area').width();
    } else {
      this.carMapProperties.x = birdeyeSW;
    }
    if(600 > windowH) {
      let mainH = (windowH - 71) * 0.8;
      let nextButtonH = 38;
      let birdeyeyH = mainH - nextButtonH - 5;
      let birdeyeW = birdeyeyH * birdeyeSW / birdeyeSH;
      //$('#birdeye_area').height(birdeyeyH);
      $('#birdeye_area .car-canvas').width(birdeyeW);
      this.carMapProperties.x = birdeyeW;
      this.carMapProperties.y = birdeyeyH;
    } else {
      this.carMapProperties.y = birdeyeSH;
    }

    this.carImgLaod = true;
    this.markList = [];
  }

  /*
  insert the mark to the list
  */
  insertMarkToList($event: any) {
    for(let i=0; i<this.markList.length; i++) {
      if($event.id === this.markList[i].id) {
        return i;
      }
    }

    this.markList.push($event);
    return -1;
  }

  /*
  click event on canvas
  */
  clickOnImage($event: any) {
    let check = this.insertMarkToList($event);
    if(check !== -1) {
      this._confirmModelService.openDialog(this, check, this._viewContainer);
      return;
    }
    let value = ($event as any).value;
    let autoPartId = (value as any).AutoPartID;
    this._damageModelService.openDialog(autoPartId, this, this._viewContainer);
  }

  doneAutoPart(list = this.markList) {
    if(list.length > 0) {
      this.checkBookMark.emit(true);
    } else {
      this.checkBookMark.emit(false);
    }
  }
}
