import { Component,
  ViewContainerRef,
  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Config }                 from '../shared/index';
import { DataService }            from '../core/data.service';
import { StoreService }           from '../core/store.service';
import { EventService }           from '../core/event.service';
import { NavbarService }          from '../core/navbar.service';
import { SpinnerService }         from '../shared/index';
import { DisclaimerModelService } from './modal/disclaimer.modal.service';
import { Modal }                  from 'angular2-modal/plugins/bootstrap';
declare var $: any;

/**
 * This class represents the lazy loaded EstimateComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-estimate',
  templateUrl: 'estimate.component.html',
  styleUrls: ['estimate.component.css']
})
export class EstimateComponent implements OnInit {
	estimateData: string;
  loading: boolean;
  isDotSlider: boolean;
  isButtons: boolean;

  slug: string;
  backendApi: string;
  totalStep: number;
  currentStep: number;

	constructor(private _dataService: DataService,
    private _storeService: StoreService,
    private activeRoute: ActivatedRoute,
    private _eventService: EventService,
    private _router: Router,
    private _navbarService: NavbarService,
    private _viewContainer: ViewContainerRef,
    private _disclaimerModal: DisclaimerModelService,
    private _spinner: SpinnerService,
    private modal: Modal) {
    this.loading = false;
    this.isDotSlider = false;
    this.isButtons = false;
    this.estimateData = '';
    this._spinner.start();
    this.backendApi = Config.API;
    modal.overlay.defaultViewContainer = _viewContainer;
  }

  ngOnInit() {
    // activeRoute param
    this.activeRoute.params.subscribe(params=> {
      this.slug = params['id'];
      this._storeService.set('slugID', this.slug);
      let postData = {
        code: 200,
        data: {
          slug: this.slug
        }
      };

      this._dataService.post('v1/estimate/estimate ', postData)
        .subscribe((res: any) => {
          let data = res.data;
          console.log(data);
          if(data.steps) {
            this.isDotSlider = true;
          } else {
            this.isDotSlider = false;
          }
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

          if(data.hasOwnProperty('action')) {
            this.isButtons = true;
          } else {
            this.isButtons = false;
          }

          this._eventService.emit('load_topbar_data', {
            helpIcon: helpIcon,
            helpStatus: helpStatus,
            liveHelpIcon: liveHelpIcon,
            liveHelpStatus: liveHelpStatus,
            logoIcon: logoIcon,
            helpLink: data.help.link
          });

          let estimateDataUrl = res.data.estimateHtml;
          let isShowEstimateModal = res.data.showDisclaimer;
          let strDisclaimer = res.data.disclaimer;

          this._dataService.get(estimateDataUrl, false)
            .subscribe((res: any) => {
              this.estimateData = res._body;
              this.init();
              this.loading = true;
              if(isShowEstimateModal) {
                this._disclaimerModal.openDialog(strDisclaimer, this._viewContainer);
              }
              this._spinner.stop();
            }, (error: any) => console.error('Unable to fetch brands', error));
        }, (error: any) => console.error('Unable to fetch brands', error));
    });
  }

  init(counter: number = 0) {
    if(counter > 50) {
      console.log('Fail to load the estimate element.');
    } else if($('.estimate-body').length <= 0) {
      counter ++;
      setTimeout(() => this.init(counter), 50);
    } else {
      $('.estimate-body').html(this.estimateData);
    }
  }

  next() {
    this._router.navigate(['/next', this.slug]);
  }
}
