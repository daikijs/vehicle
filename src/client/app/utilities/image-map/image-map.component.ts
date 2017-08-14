import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  Renderer,
  EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService }  from '../../core/data.service';
import { CoordiateModel, CanvasStyleModel }  from '../../core/model';
import { Config } from '../../shared/index';
declare let $: any;

/**
 * This class represents the lazy loaded ImageMapComponent.
 */

@Component({
  moduleId: module.id,
  selector: 'image-map',
  templateUrl: 'image-map.component.html',
  styleUrls: ['image-map.component.css']
})

export class ImageMapComponent implements  OnInit {
  @Input('mapData') mapData: Object;
  @Input('mapProperties') mapProperties: CoordiateModel;
  @Input('mapStyle') mapStyle: CanvasStyleModel;
  @Input('bCarmap') bCarmap: boolean;
  @Input('bPreShowDamages') bPreShowDamages: boolean;
  @Output() clickOnImage = new EventEmitter();
  @Output() doneAutoPart = new EventEmitter();
  @Output() loadImage = new EventEmitter();

  mapList: any[];
  selectedPolygonList: any[];
  mapImg: string;
  mapImgLaod: boolean;
  isLoadFont: boolean;
  isOutlineMethod: boolean;
  mapCanvas: any;
  effectCanvas: any;
  previousRegionIndex: number = -1;
  selectedIndexArray: number[] = [];
  canvasToimageRateW: number;
  canvasToimageRateH: number;
  currentSPIndex: number; // current selected polygon index
  currentDamageIndex: number;

  imageMapId: string;
  imageId: string;
  imageCanvasId: string;
  effectCanvasId: string;
  imgSrc: string;

  constructor(
    private el: ElementRef,
    private router: Router,
    private _dataService: DataService,
  	private renderer: Renderer
  ) {
    this.currentSPIndex = -1;
    this.currentDamageIndex = -1;
    this.isLoadFont = false;
    this.isOutlineMethod = false;
  }

  ngOnInit() {
    this.mapImgLaod = false;
    this.selectedPolygonList = [];
    if(this.mapData) {
      this.mappingData(this.mapData);
      this.imageMapId = this.uuid('0123456789abcdef');
      this.imageId = this.imageMapId + '_image_map';
      this.imageCanvasId = this.imageMapId + '_image_canvas';
      this.effectCanvasId = this.imageMapId + '_effect_canvas';
    } else {
      console.log('Please refresh again to mapping image.');
    }
  }

  clearSelectedCanvas(polygonNumber: number) {
    for(let i=0; i<polygonNumber; i++) {
      this.selectedIndexArray[i] = 0;
    }
  }

  /**
   * Draws a rounded rectangle using the current state of the canvas. 
   * If you omit the last three params, it will draw a rectangle 
   * outline with a 5 pixel border radius 
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate 
   * @param {Number} width The width of the rectangle 
   * @param {Number} height The height of the rectangle
   * @param {Number} radius The corner radius. Defaults to 5;
   * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
   * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
   */
  roundRect(ctx: any, x: number, y:number, width:number, height:number, radius:number=5, fill: boolean, stroke: boolean = true) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
  }

  drawPlusIcon(
    x: number,
    y: number,
    bigSize: boolean,
    detail: boolean = false,
    detailText: string = '',
    checked: boolean = false,
    iconUrl: string = '') {

    let ctx = this.mapCanvas.getContext('2d');
    var metrics = ctx.measureText(detailText);
    let detailTextWidth = metrics.width;

    let imgStartX = x * this.canvasToimageRateW;
    let imgStartY = y * this.canvasToimageRateH;

    let bLeftSituation = false;

    if(this.mapCanvas.width/2 > imgStartX) {
      bLeftSituation = true;
    } else {
      bLeftSituation = false;
    }

    ctx.strokeStyle = '#017bff';
    ctx.fillStyle = 'rgba(255,255,255,1.0)';
    if(!detail) {
      this.roundRect(ctx, imgStartX, imgStartY, 20, 20, 10, true);
    } else {

      if(!bLeftSituation) {
        this.roundRect(ctx, (imgStartX-detailTextWidth-10), imgStartY, detailTextWidth+30, 20, 10, true);
        ctx.fillStyle = '#017bff';
        ctx.font='12px';
        ctx.fillText(detailText, (imgStartX + 8 - detailTextWidth - 10), imgStartY+14);
      } else {
        this.roundRect(ctx, imgStartX, imgStartY, detailTextWidth+30, 20, 10, true);
        ctx.fillStyle = '#017bff';
        ctx.font='12px';
        ctx.fillText(detailText, imgStartX+18, imgStartY+14);
      }

    }

    if(iconUrl && iconUrl !== '') {

      let ctxImg = this.mapCanvas.getContext('2d');
      let imgW = 14, imgH = 14;
      let circleSize = 20;
      let spaceSize = (circleSize - imgW) / 2;

      let img = new Image();
      img.src = iconUrl;
      let that = this;
      img.onload = function() {
        ctxImg.globalAlpha = 1;
        ctxImg.drawImage(img, imgStartX + spaceSize, imgStartY + spaceSize, imgW, imgH);
        that.mapImgLaod = true;
      };

      img.onerror = function() {
        console.log('This image url is invalid: ' + img.src);
      };
    } else {
      let fontawesomeSize = ctx.measureText('\uF067').width;
      ctx.fillStyle = '#017bff';
      ctx.font='10px FontAwesome';
      this.checkReady(ctx, imgStartX, imgStartY, checked, fontawesomeSize);
    }

  }

  checkReady(
    ctx: any,
    imgStartX: number,
    imgStartY: number,
    checked: boolean,
    fontawesomeSize: number,
    count: number = 0) {
    let currentFontawesomeSize = ctx.measureText('\uF067').width;

    if(count > 20) {
      console.log('Time out to load the font awesome.');
    } else if(!this.isLoadFont && currentFontawesomeSize === fontawesomeSize) {
      count ++;
      setTimeout(() => this.checkReady(ctx, imgStartX, imgStartY, checked, currentFontawesomeSize, count), 100);
    } else {
      if(!checked) {
        ctx.fillText('\uF067', imgStartX+6, imgStartY+15);
      } else {
        ctx.fillText('\uF00C', imgStartX+6, imgStartY+15);
      }
      this.isLoadFont = true;
    }
  }


  /*
  mapping back end data to local variable
  */
  mappingData(res:any) {
    if(this.bPreShowDamages) { // damage modal

      let mapList = res.data.map;
      this.mapImg = res.data.img;
      this.imgSrc = this._dataService.host + this.mapImg;
      this.mapList = [];
      let indexCounter = 0;

      // catch coordinates from api
      for(let item in mapList) {
        let parentPolygon: CoordiateModel[] = [];
        let parentObject = <any>{};
        let polygonIndex: number;
        parentObject['parentData'] = mapList[item];

        mapList[item].Coordinates.split(',').forEach(function(e: any, i: number) {
          if(i%2 === 0) {
            polygonIndex = i/2;
            parentPolygon[polygonIndex] = new CoordiateModel();
            parentPolygon[polygonIndex].x = parseInt(e);
          } else {
            parentPolygon[polygonIndex].y = parseInt(e);
          }
        });

        parentObject['parentPolygons'] = parentPolygon;
        parentObject['index'] = indexCounter;

        if(mapList[item]['Title']==='Bound Box' && mapList[item]['child']) { // bounding box
          parentObject['child'] = [];

          for(let childItem in mapList[item]['child']) {
            let childNewItem = <any>{};
            indexCounter ++;
            let childPolygon: CoordiateModel[] = [];
            let childPolygonIndex: number;

            mapList[item]['child'][childItem].Coordinates.split(',').forEach(function(childE: any, childI: number) {
              if(childI%2 === 0) {
                childPolygonIndex = childI/2;
                childPolygon[childPolygonIndex] = new CoordiateModel();
                childPolygon[childPolygonIndex].x = parseInt(childE);
              } else {
                childPolygon[childPolygonIndex].y = parseInt(childE);
              }
            });

            childNewItem['data'] = mapList[item]['child'][childItem];
            childNewItem['polygons'] = childPolygon;
            childNewItem['index'] = indexCounter;
            parentObject['child'].push(childNewItem);

          }

          if(mapList[item]['sub']) {
            parentObject['sub'] = [];

            for(let subItem in mapList[item]['sub']) {
              let subNewItem = <any>{};
              let subPolygon: CoordiateModel[] = [];
              let subPolygonIndex: number;

              mapList[item]['sub'][subItem].Coordinates.split(',').forEach(function(subE: any, subI: number) {
                if(subI%2 === 0) {
                  subPolygonIndex = subI/2;
                  subPolygon[subPolygonIndex] = new CoordiateModel();
                  subPolygon[subPolygonIndex].x = parseInt(subE);
                } else {
                  subPolygon[subPolygonIndex].y = parseInt(subE);
                }
              });

              subNewItem['data'] = mapList[item]['sub'][subItem];
              subNewItem['polygons'] = subPolygon;
              parentObject['sub'].push(subNewItem);
            }
          }

        }

        this.mapList.push(parentObject);
        indexCounter ++;
      }

      this.mapImgLaod = true;
    } else {
      if(res['data']['method']=== 'outline') {
        this.isOutlineMethod = true;
        this.mapList = [];
        let mapList = res.data.map;
        this.mapImg = res.data.img;
        this.imgSrc = this._dataService.host + this.mapImg;
        // catch coordinates from api
        for(let item in mapList) {
          let marker: number[] = [];
          let polygon: CoordiateModel[] = [];
          let polygonIndex: number;

          mapList[item].Coordinates.split(',').forEach(function(e: any, i: number) {
            marker.push(parseInt(e));
            if(i%2 === 0) {
              polygonIndex = i/2;
              polygon[polygonIndex] = new CoordiateModel();
              polygon[polygonIndex].x = parseInt(e);
            } else {
              polygon[polygonIndex].y = parseInt(e);
            }
          });

          this.mapList.push({
            polygon: polygon,
            data: mapList[item]
          });
          this.mapImgLaod = true;
        }
        console.log(this.mapList);
      } else {
        this.isOutlineMethod = false;
        this.mapList = res.data.top_map;
        this.mapImg = res.data.top_img;
        this.imgSrc = this._dataService.host + this.mapImg;
        this.mapImgLaod = true;
      }
    }

    if(this.mapList) {
      this.clearSelectedCanvas(this.mapList.length);
      this.loadCarImage();
    } else {
      console.log('The map list data is not loaded.');
    }
  }

  loadImg() {
    this.loadImage.emit();
  }

  /*
  create id
  */
  uuid(key: string = '0123456789abcdef') {
    var chars = key.split('');

    let uuid: any[] = [], rnd = Math.random, r: any;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4'; // version 4

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | rnd()*16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
      }
    }

   return uuid.join('');
  }

  //+++

  // checkPolygonSize(polygonList: CoordiateModel[]) {
  //   let min = polygonList[0].x + polygonList[0].y;
  //   let max = polygonList[0].x + polygonList[0].y;
  //   let minId = 0;
  //   let maxId = 0;

  //   for(let i=0; i<polygonList.length; i++) {
  //     if(min > (polygonList[i].x + polygonList[i].y)) {
  //       min = polygonList[i].x + polygonList[i].y;
  //       minId = i;
  //     }

  //     if(max < (polygonList[i].x + polygonList[i].y)) {
  //       max = polygonList[i].x + polygonList[i].y;
  //       maxId = i;
  //     }
  //   }

  //   if(max-min > 80) {
  //     return true;
  //   } else {
  //     return false;
  //   }

  // }

  //+++

  /*
  draw all damage area
  */
  drawAllDamageArea() {
    if(this.bPreShowDamages === true) {
      let style = {
        bgColor: 'blue',
        borderColor: 'black',
        bgOpacity: 0.1,
        borderWidth: 2
      };
      this.drawDamagePolygons(this.mapCanvas, style);
    } else {
      if(this.isOutlineMethod === true) {
        let style = {
          bgColor: 'transparent',
          borderColor: 'black',
          bgOpacity: 0.1,
          borderWidth: 2
        };

        for(let i=0;i<this.mapList.length; i++) {
          this.drawPolygons(this.mapCanvas, this.mapList[i]['polygon'], style);
        }
      } else {
        this.drawDamageIcons(this.isLoadFont);
      }
    }
  }

  /*
  check if the current index is inside the selected polygon list
  */
  checkPolygonIndex(index: number) {
    for(let i=0; i<this.selectedPolygonList.length; i++) {
      if(this.selectedPolygonList[i]['id'] === index) {
        return true;
      }
    }

    return false;
  }

  /*
  draw entire damage polygons with limited rule
  */
  drawDamagePolygons(
    canvas: any,
    style: Object
  ) {
    let selectedStyle = {
      bgColor: this.mapStyle.bgColor,
      borderColor: this.mapStyle.borderColor,
      bgOpacity: this.mapStyle.bgOpacity,
      borderWidth: this.mapStyle.borderWidth,
    };
    let ctx = canvas.getContext('2d');
    let canvasStyle: Object;

    for(let i=0; i<this.mapList.length; i++) {
      let item = this.mapList[i];
      if(item['parentData']['Title'] === 'Bound Box') {
        // save the unclipped context
        ctx.save();

        // define the path that will be clipped to
        ctx.beginPath();
        for(let c=0; c<item['parentPolygons'].length; c++) {
          if(c === 0) {
            ctx.moveTo(item['parentPolygons'][c]['x']*this.canvasToimageRateW, item['parentPolygons'][c]['y']*this.canvasToimageRateH);
          } else {
            ctx.lineTo(item['parentPolygons'][c]['x']*this.canvasToimageRateW, item['parentPolygons'][c]['y']*this.canvasToimageRateH);
          }
        }

        ctx.closePath();

        // stroke the path
        // half of the stroke is outside the path
        // the outside stroke will survive the clipping that follows
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle= 'black';
        ctx.lineWidth=2;
        ctx.stroke();

        // make the current path a clipping path
        ctx.clip();

        // draw the image which will be clipped except in the clipping path
        for(let j=0; j<item['child'].length; j++) {
          let bSelected = this.checkPolygonIndex(item['child'][j]['index']);

          if(bSelected) {
            canvasStyle = selectedStyle;
          } else {
            canvasStyle = style;
          }

          this.drawPolygons(this.mapCanvas, item['child'][j]['polygons'], canvasStyle);
        }

        // restore the unclipped context (==undo the clipping path)
        ctx.restore();
      } else {
        let bSelected = this.checkPolygonIndex(item['index']);

        if(bSelected) {
          canvasStyle = selectedStyle;
        } else {
          canvasStyle = style;
        }

        this.drawPolygons(this.mapCanvas, item['parentPolygons'], canvasStyle);
      }
    }
  }

  /*
  load background car image to canvas
  */
  loadCarImage(nCount: number = 0) {
    this.mapCanvas = document.getElementById(this.imageCanvasId);
    this.effectCanvas = document.getElementById(this.effectCanvasId);
    let $img = document.getElementById(this.imageId);

    if(nCount > 30) {
      console.log('Timeout to load the image!');
    } else if(!this.mapCanvas) {
      nCount ++;
      setTimeout(() => this.loadCarImage(), 100);
    } else {
      this.mapCanvas.width     = this.mapProperties.x;
      this.mapCanvas.height    = this.mapProperties.y;
      this.effectCanvas.width  = this.mapProperties.x;
      this.effectCanvas.height = this.mapProperties.y;

      let that = this;
      let img = new Image();
      img.src = this._dataService.host + this.mapImg;
      img.onload = function() {
        ($img as any).width = that.mapProperties.x;
        ($img as any).height = that.mapProperties.y;
        that.canvasToimageRateW = that.mapCanvas.width / img.width;
        that.canvasToimageRateH = that.mapCanvas.height / img.height;
        that.mapImgLaod = true;

        that.drawAllDamageArea();
      };

      img.onerror = function() {
        console.log('This image url is invalid: ' + img.src);
      };
    }
  }

  /*
  check if point is inside polygon
  params:
  - poly: the coordinate array where the polygon is covered
  - pt: the coordinate which is on current mouse
  return:
  true or false which point is in polygon
  */
  isPointInPoly(poly: CoordiateModel[], pt: CoordiateModel) {

    var inside = false;

    let x = pt.x;
    let y = pt.y;

    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i].x, yi = poly[i].y;
      var xj = poly[j].x, yj = poly[j].y;

      var intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
  }

  /*
  get the position (index) in damage array
  params:
  - mousePoint: the current mouse point coordinate
  return:
  index which is global polygonList array index
  */
  getCurrentPosition(mousePoint: CoordiateModel) {
    let mousePointOnRate = new CoordiateModel();
    mousePointOnRate.x = mousePoint.x / this.canvasToimageRateW;
    mousePointOnRate.y = mousePoint.y / this.canvasToimageRateH;

    if(this.bPreShowDamages) { // damage popup modal
      for(let i=0; i<this.mapList.length; i++) {
        let item = this.mapList[i];
        if(item['parentData']['Title'] === 'Bound Box') {
          for(let j=0; j<item['child'].length; j++) {

            if(this.isPointInPoly(item['child'][j]['polygons'], mousePointOnRate)) {
              if(this.isPointInPoly(item['parentPolygons'], mousePointOnRate)) {
                return item['child'][j]['index'];
              } else {
                return -1;
              }
            }
          }
        } else {
          if(this.isPointInPoly(item['parentPolygons'], mousePointOnRate)) {
            return item['index'];
          }
        }
      }
    } else {
      if(this.isOutlineMethod) {
        let mousePointOnRate = new CoordiateModel();
        mousePointOnRate.x = mousePoint.x / this.canvasToimageRateW;
        mousePointOnRate.y = mousePoint.y / this.canvasToimageRateH;

        for(let i=0; i<this.mapList.length; i++) {
          if(this.isPointInPoly(this.mapList[i]['polygon'], mousePointOnRate)) {
            return i;
          }
        }
        return -1;
      } else {
        for(let i=0; i<this.mapList.length; i++) {
          if(this.mapList[i].hasOwnProperty('x') && this.mapList[i].hasOwnProperty('y')) {
            let pt = this.mapList[i];
            let xRightDeviation = 20;
            let yRightDeviation = 20;
            let xOppositeDeviation = 0;

            if(this.currentDamageIndex === i) {
              let startX = pt['x'] * this.canvasToimageRateW;
              let ctx = this.mapCanvas.getContext('2d');
              var metrics = ctx.measureText(this.mapList[i]['Part']);
              let detailTextWidth = metrics.width;

              if(this.mapCanvas.width/2 < startX) {
                xOppositeDeviation -= detailTextWidth;
                xOppositeDeviation -= 10;
              } else {
                xRightDeviation += detailTextWidth;
                xRightDeviation += 10;
              }
            }

            if((pt['x'] + xOppositeDeviation) <= mousePointOnRate.x &&
              pt['y'] <= mousePointOnRate.y &&
              (pt['x'] + xRightDeviation) >= mousePointOnRate.x &&
              (pt['y'] + yRightDeviation) >= mousePointOnRate.y) {
              return i;
            }

          } else {
            console.log('X and Y of the map list is not existed');
          }
        }
      }
    }

    return -1;
  }

  /*
  draw the polygon into canvas
  params:
  - coordinate: the coordinate array which cover the polygon
  - bgColor: the polygon background
  */
  drawPolygons(canvas: any,
    polygon: CoordiateModel[],
    style: Object) {
    let ctx = canvas.getContext('2d');
    let effectCtx = this.effectCanvas.getContext('2d');
    effectCtx.clearRect(0, 0, this.effectCanvas.width, this.effectCanvas.height);

    if(!polygon) {
      console.log('Not ready to draw polygon.');
      return;
    }

    for(let i=0; i<polygon.length; i ++) {
      if(i===0) {
        ctx.beginPath();
        ctx.moveTo(polygon[i].x*this.canvasToimageRateW, polygon[i].y*this.canvasToimageRateH);
      } else {
        ctx.lineTo(polygon[i].x*this.canvasToimageRateW, polygon[i].y*this.canvasToimageRateH);
      }
    }
    ctx.closePath();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle= (style as any).borderColor;
    ctx.lineWidth = (style as any).borderWidth;
    ctx.stroke();
    ctx.globalAlpha = (style as any).bgOpacity;
    ctx.fillStyle = (style as any).bgColor;
    ctx.fill();
  }

  /*
  clear effective canvas area
  */
  clearEffectiveCanvas() {
    let ctx = this.effectCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.effectCanvas.width, this.effectCanvas.height);
  }

  /*
  get polygon data with id in the map list
  */
  getPolygonData(index: number) {
    for(let i=0; i<this.mapList.length; i++) {
      let item = this.mapList[i];
      if(item['parentData'] && item['parentData']['Title'] === 'Bound Box') {
        for(let j=0; j<item['child'].length; j++) {
          if(item['child'][j]['index'] === index) {
            return item['child'][j]['polygons'];
          }
        }
      } else {
        if(item['index'] === index) {
          return item['parentPolygons'];
        }
      }
    }

    return null;
  }

  /*
  delete polygon
  */
  updatePolygon(polygon: any[]) {
    this.selectedPolygonList = polygon;
    let myCtx = this.mapCanvas.getContext('2d');
    myCtx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
    this.drawAllDamageArea();
    // for(let i=0; i<polygon.length; i++) {
    //   let polygonListData = this.getPolygonData(polygon[i]['id']);
    //   if(polygonListData) {
    //     this.drawPolygons(this.mapCanvas, polygonListData, style);
    //   } else {
    //     console.log('Do not match with id');
    //   }
    //   //this.drawPolygons(this.mapCanvas, this.polygonList[polygon[i].id], style);
    // }

  }

  /*
  get checkmark postion
  */
  getCheckMarkPostion(polygonId: number) {
    let position = new CoordiateModel();
    let sx = 0,
    sy = 0,
    sL = 0;
    let polygons: CoordiateModel[] = this.mapList[polygonId]['polygon'];

    for(let i = 0; i < polygons.length; i ++) {
      let x0: number, y0: number, x1: number, y1: number;
      if(i===0) {
        x0 = polygons[polygons.length-1].x;
        y0 = polygons[polygons.length-1].y;
      } else {
        x0 = polygons[i-1].x;
        y0 = polygons[i-1].y;
      }

      x1 = polygons[i].x;
      y1 = polygons[i].y;
      let L = Math.pow(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2), 0.5);
      sx += (x0 + x1)/2 * L;
      sy += (y0 + y1)/2 * L;
      sL += L;
    }
    position.x = sx / sL;
    position.y = sy / sL;

    return position;
  }

  /*
  draw checkmark
  */
  drawCheckMark(polygonId: number) {
    if(!this.isOutlineMethod) {
      return;
    }

    let polygonPostion: CoordiateModel = this.getCheckMarkPostion(polygonId);

    let imgSrc = 'assets/img/checkmark.png';
    let ctxImg = this.mapCanvas.getContext('2d');
    let imgW = 30, imgH = 30;
    let imgStartX = polygonPostion.x * this.canvasToimageRateW - imgW/2;
    let imgStartY = polygonPostion.y * this.canvasToimageRateH - imgH/2;
    let img = new Image();
    img.src = imgSrc;
    let that = this;
    img.onload = function() {
      ctxImg.globalAlpha = 1;
      ctxImg.drawImage(img, imgStartX, imgStartY, imgW, imgH);
      that.mapImgLaod = true;
    };

    img.onerror = function() {
      console.log('This image url is invalid: ' + img.src);
    };
  }

  /*
  draw all hint plus icons
  */
  drawDamageIcons(isLoadFont: boolean = false) {
    let apiUrl = Config['API'];
    let ctx = this.mapCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);

    for(let i=0; i<this.mapList.length; i++) {
      // let status = this.checkPolygonSize(this.polygonList[i]);
      let bDetail = false;
      let strDetail = '';
      let bChecked = false;
      let iconUrl = '';

      if(i===this.currentDamageIndex) {
        bDetail = true;
        if( this.mapList[i].hasOwnProperty('Part') ) {
          strDetail = this.mapList[i]['Part'];
        }
      }

      if( this.mapList[i].hasOwnProperty('Icon') ) {
        iconUrl = apiUrl + this.mapList[i]['Icon'];
      }

      if(this.selectedIndexArray[i] === 1) {
        bChecked = true;
      }

      this.drawPlusIcon(this.mapList[i].x, this.mapList[i].y, false, bDetail, strDetail, bChecked, iconUrl);
    }
  }

  /*
  get the damage data with index
  */
  getDamageData(index: number) {

    for(let i=0; i<this.mapList.length; i++) {
      let item = this.mapList[i];
      if(item['parentData'] && item['parentData']['Title'] === 'Bound Box') {
        for(let j=0; j<item['child'].length; j++) {

          if(index === item['child'][j]['index']) {
            let returnData = <any>{};
            returnData['data'] = item['child'][j]['data'];
            if(item['sub']) {
              let arrIntersects: any[] = [];

              for(let c=0; c<item['sub'].length; c++) {
                if( this.checkIntersectionOfPolygons(item['child'][j]['polygons'], item['sub'][c]['polygons']) ) {
                  if(item['sub'][c]['data']['id']) {
                    arrIntersects.push(item['sub'][c]['data']['id']);
                  }
                }
              }
              console.log(arrIntersects);
              if(arrIntersects.length > 0) {
                returnData['intersect'] = arrIntersects;
              }
            }
            return returnData;
          }
        }
      } else {
        if(index === item['index']) {
          return {
            data: item['parentData']
          };
        }
      }
    }

    return null;
  }

  /*
  click event on canvas
  */
  canvasClick(event: any) {
    event = event || window.event;
    let currentP = new CoordiateModel();

    currentP.x = event.offsetX;
    currentP.y = event.offsetY;
    let currentSelectedInd = this.getCurrentPosition(currentP);
    console.log('currentSelectedInd: '+currentSelectedInd);
    this.currentSPIndex = currentSelectedInd;

    if(currentSelectedInd<0) {
      console.log('There is no image for the Current Position');
    } else {
      if(!this.bPreShowDamages) { // birdeye view
        if(this.isOutlineMethod) {
          this.clickOnImage.emit({value: this.mapList[currentSelectedInd]['data'], id: currentSelectedInd});
        } else {
          if(currentSelectedInd === this.currentDamageIndex) {
            this.clickOnImage.emit({value: this.mapList[currentSelectedInd], id: currentSelectedInd});

          } else {
            this.currentDamageIndex = currentSelectedInd;
            this.drawDamageIcons(this.isLoadFont);
          }
        }
      } else {
        let damageData = this.getDamageData(currentSelectedInd);
        if(damageData) {
          console.log(damageData);
          this.clickOnImage.emit({value: damageData, id: currentSelectedInd});
        } else {
          console.log('Can not find the damage data with the index');
        }

      }
    }
  }

  /*
  over event on canvas
  */
  canvasOver(event: any) {
    if(!this.bPreShowDamages && !this.isOutlineMethod) {
      return;
    }

    event = event || window.event;console.log(event);
    let currentP = new CoordiateModel();
    currentP.x = event.offsetX;
    currentP.y = event.offsetY;
    let currentSelectedInd = this.getCurrentPosition(currentP);
    if(this.currentSPIndex === currentSelectedInd) {
      return;
    }

    if(this.selectedIndexArray[currentSelectedInd] === 1) {
      this.clearEffectiveCanvas();
      return;
    }
    this.currentSPIndex = currentSelectedInd;

    if(currentSelectedInd<0) {
      console.log('There is no image for the Current Position');
    } else {
      if(this.bPreShowDamages) {
        let style = {
          bgColor: this.mapStyle.bgOverColor,
          borderColor: this.mapStyle.borderOverColor,
          bgOpacity: this.mapStyle.bgOverOpacity,
          borderWidth: this.mapStyle.borderOverWidth,
        };

        let damageData = this.getDamageData(currentSelectedInd);
        if(damageData) {
          this.drawPolygons(this.effectCanvas, damageData, style);
        } else {
          console.log('Can not find the damage data with the index');
        }
      }
    }
  }

  /*
  leave event on canvas
  */
  canvasLeave() {
    this.clearEffectiveCanvas();
  }

  /*
  display checkMark
  */
  displayCheckMark() {
    this.drawCheckMark(this.currentSPIndex);
    this.selectedIndexArray[this.currentDamageIndex] = 1;
    this.currentDamageIndex = -1;
    this.drawAllDamageArea();
    this.doneAutoPart.emit();
  }

  /*
  update check mark with list
  */
  updateCheckMark(markList: any[]) {console.log(111);
    let that = this;
    for(let i=0; i<markList.length; i++) {
      if(markList[i].id !== that.currentSPIndex) {
        // this.drawCheckMark(markList[i].id);
      }
    }
  }

  /*
  delete the check mark
  */
  deleteCheckMark(markId: number) {
    this.selectedIndexArray[markId] = 0;
    this.drawDamageIcons();
  }

  checkIntersectionOfPolygons(fstPolygon:CoordiateModel[], sndPolygon:CoordiateModel[]) {
    let result = false;

    result = this.checkPointsInsidePolygon(fstPolygon, sndPolygon);

    if(!result) {
      result = this.checkPointsInsidePolygon(sndPolygon, fstPolygon);
    }

    return result;
  }

  checkPointsInsidePolygon(points:CoordiateModel[], polygon:CoordiateModel[]) {
    for(let i=0; i<points.length; i++) {
      if( this.isPointInPoly(polygon, points[i]) ) {
        return true;
      }
    }

    return false;
  }
}
