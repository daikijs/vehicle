import { Component,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  ViewContainerRef,
  OnInit } from '@angular/core';
import { Http }                from '@angular/http';
import { Config }              from '../shared/index';
import { DataService }         from '../core/data.service';
import { EventService }        from '../core/event.service';
import { StoreService }        from '../core/store.service';
import { SpinnerService }      from '../shared/index';
import { UploadModelService }  from './modal/upload.modal.service';
import { ShowImgModelService } from './modal/show.img.modal.service';
import { Modal }               from 'angular2-modal/plugins/bootstrap';
declare let $: any;
/**
 * This class represents the lazy loaded CarMapComponent.
 */

@Component({
  moduleId: module.id,
  selector: 'image-location',
  templateUrl: 'img.component.html',
  styleUrls: ['img.component.css']
})

export class ImgComponent implements OnInit {
  imgList: Object[];
  @Input('slugId') slugId: string;
  @Output() loadData = new EventEmitter();
  @Output() checkStep = new EventEmitter();

  URL: string;
  backendApi: string;

  selectedItem: number;

  uploadStatus: number[] = [];
  photoRequires: number[] = []; // required photo array
  isAccordionOpened: boolean[] = [];
  host: any;

  constructor(
    private http: Http,
    private el: ElementRef,
    private _dataService: DataService,
    private _eventService: EventService,
    private _spinner: SpinnerService,
    private _storeService: StoreService,
    private _uploadModelService: UploadModelService,
    private _showImgModelService: ShowImgModelService,
    private _viewContainer: ViewContainerRef,
    private modal: Modal
) {


this.host = 'http://ve-.local/';

    this._spinner.start();
    this.URL = this.host + 'v1/data/fileupload';
    this.imgList = [];
    this.backendApi = Config.API;
    this.selectedItem = -1;
    modal.overlay.defaultViewContainer = _viewContainer;
  }

  ngOnInit() {
    let postData = {
      code: 200,
      data: {
        slug: this.slugId
      }
    };

    this._dataService.post('v1/data/photosrequested', postData)
      .subscribe((res: any) => {console.log(res);
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
        // get the slug
        this.host = this._dataService.host;
        this.imgList = res.data.photos.map((item: any) => {
          item.uploadedImgUrl = '';
          item.uploaded = false;
          item.uploadStatus = false;
          return item;
        });

        this.checkNextStep();

        this.slugId = res.data.slug;
        for(let i=0; i<this.imgList.length; i++) {
          this.uploadStatus[i] = 0;
          this.isAccordionOpened[i] = false;
          if(parseInt((this.imgList[i] as any).required) === 1) {
            this.photoRequires[i] = 1;
          } else {
            this.photoRequires[i] = 0;
          }
        }
        this._spinner.stop();
        this.isAccordionOpened[0] = true;
      }, (error: any) => console.error('Unable to fetch brands', error));
  }

  checkNextStep() {
    let isNext = true;

    for(let i=0; i< this.imgList.length; i ++) {
      if((this.imgList[i] as any).required) {
        isNext = false;
        break;
      }
    }
    this.checkStep.emit(isNext);
  }

  /*
  clear opened accordion array
  */
  clearAccordion() {
    for(let i=0; i<this.isAccordionOpened.length; i++) {
      this.isAccordionOpened[i] = false;
    }
  }

  openUploadModal(index: number) {
    this.selectedItem = index;
    let data = this.imgList[index];
    if(!data.hasOwnProperty('id')) {
      console.log('id property does not exist');
      return;
    }

    let postData = {
      code: 200,
      data: {
        slug: this.slugId,
        UserID: 0,
        PhotoID: (data as any).id
      }
    };

    if((data as any).uploaded) {
      let title = (data as any).text;
      let imgUrl = this.backendApi + (data as any).uploadedImgUrl;
      this._showImgModelService.openDialog(title, imgUrl, postData, this._viewContainer)
        .then((dialog: any) => {
          dialog.result.then((returnData: any) => {
            if((returnData as any).status) {
              (this.imgList[index] as any).uploadedImgUrl = (returnData as any).url;
            }
          });

        });
    } else {
      this._uploadModelService.openDialog(this.imgList, index, postData, this._viewContainer)
        .then(dialog => {
          dialog.result.then(returnData => {
            this.checkNextStep();
          });

        });
    }
  }
}
