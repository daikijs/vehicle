import { Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Config }                 from '../shared/index';
import { DataService }            from '../core/data.service';
import { EventService }           from '../core/event.service';
import { SpinnerService }         from '../shared/index';

/**
 * This class represents the lazy loaded VehicleComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-vehicle',
  templateUrl: 'vehicle.component.html',
  styleUrls: ['vehicle.component.css']
})

export class VehicleComponent implements OnInit, OnDestroy {
	slug: number;
  totoalStep: number;
  currentStep: number;

  helpIcon: string;
  liveHelpIcon: string;
  helpStatus: boolean;
  liveHelpStatus: boolean;
  isPageLoading: boolean;

	sub: any;

  backendApi: string;

  vehicleData: Object;
  PEMISSIONDENIED = 'Permission denied.';
  bCheckPermission: boolean = false;

  constructor(private route: ActivatedRoute,
    private _dataService: DataService,
    private _eventService: EventService,
    private router: Router,
    private _spinner: SpinnerService) {

    this.backendApi = Config.API;
    this.totoalStep = 0;
    this.currentStep = 0;
  }

  initVehicleData(data: any) {
    console.log(data);
    this.totoalStep = data.steps.totalStep;
    this.currentStep = data.steps.currentStep;
    this.liveHelpIcon = this.backendApi + data.liveHelp.icon;
    this.helpIcon = this.backendApi + data.help.icon;
    let logoIcon = this.backendApi + data.ui.logo;

    if(data.liveHelp.on === 1) {
      this.liveHelpStatus = true;
    } else {
      this.liveHelpStatus = false;
    }

    if(data.help.on === 1) {
      this.helpStatus = true;
    } else {
      this.helpStatus = false;
    }

    this._eventService.emit('load_topbar_data', {
      helpIcon: this.helpIcon,
      helpStatus: this.helpStatus,
      liveHelpIcon: this.liveHelpIcon,
      liveHelpStatus: this.liveHelpStatus,
      logoIcon: logoIcon,
      helpLink: data.help.link
    });
    this.isPageLoading = true;
    this._spinner.stop();
  }

  ngOnInit() {
    this.isPageLoading = false;
    this._spinner.start();
    this.sub = this.route.params.subscribe(params=> {
      this.slug = params['id'];
      this._spinner.start();
      let postData = {
        code: 200,
        data: {
          slug: this.slug
        }
      };

      this._dataService.post('v1/data/getclaim', postData)
        .subscribe((res: any) => {
          this.initVehicleData(res.data);
          this.vehicleData = res.data;
          this.redirectWithPermissionIssue();
          this.bCheckPermission = true;
          this._spinner.stop();
        }, (error: any) => console.error('Unable to fetch brands', error));

    });
  }

  ngOnDestroy() {
  	this.sub.unsubscribe();
  }

  redirectWithPermissionIssue() {
    if(this.vehicleData && (this.vehicleData as any).message === this.PEMISSIONDENIED) {
      alert((this.vehicleData as any).message);
      this.router.navigate(['/']);
    }
  }

  //from vehicle to damage
  next() {
    this._spinner.start();
    let postData = {
      code: 200,
      data: {
        slug: this.slug
      }
    };

    this._dataService.post('v1/data/birdseyeauto', postData)
      .subscribe((data: any) => {
        this._spinner.stop();
        // set the birdseyeauto array as string
        this.router.navigate(['/damage', this.slug]);
      }, (error: any) => console.error('Unable to fetch brands', error));
    }

}
