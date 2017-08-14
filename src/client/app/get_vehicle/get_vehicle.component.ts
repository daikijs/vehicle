import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Config }                 from '../shared/index';
import { DataService }  from '../core/data.service';
import { EventService } from '../core/event.service';
import { SpinnerService }  from '../shared/index';
import { StoreService }  from '../core/store.service';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
declare var $: any;

/**
 * This class represents the lazy loaded VehicleModelComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-get-vehicle',
  templateUrl: 'get_vehicle.component.html',
  styleUrls: ['get_vehicle.component.css']
})
export class GetVehicleComponent implements OnInit {
  isPageLoading: boolean;
	sub: any;
	zipcode: number;
	claimUrl: string;
	slugId: string;
	years: any[];
	makes: any[];
	models: any[];
	categories: any[];
	pageLoading: boolean;
	claimYearID: number;
	claimMakeID: number;
	claimModelID: number;
	claimCategoryID: number;
	claimMakeDisabled: boolean;
	claimModelDisabled: boolean;
	claimCategoryDisabled: boolean;
	nextAvailable: number;
	vinAvailable: boolean;
	vinCode: string;
	user: any;
	vincodeValue: any;
	vincodeNumberError: boolean;
  backendApi: string;
  totoalStep: number;
  currentStep: number;

  helpIcon: string;
  liveHelpIcon: string;
  helpStatus: boolean;
  liveHelpStatus: boolean;
  isVinRequire: boolean;
  isVinErrorAlert: boolean;

  getVehicleForm: FormGroup;

	constructor(
    private router: Router,
		private route: ActivatedRoute,
		private _dataService: DataService,
    private _eventService: EventService,
		private _storeService: StoreService,
		private _spinner: SpinnerService,
    private modal: Modal,
    private vcRef: ViewContainerRef
    ) {
    modal.overlay.defaultViewContainer = vcRef;
    this.backendApi = Config.API;
		this.pageLoading = true;
		this.nextAvailable = 0;
		this.vinAvailable = false;
		this._spinner.start();
		this.claimYearID = -1;
		this.claimMakeID = -1;
		this.claimModelID = -1;
		this.claimCategoryID = -1;
		this.claimModelDisabled = true;
		this.claimMakeDisabled = true;
		this.claimCategoryDisabled = true;
    this.isVinRequire = false;
    this.isVinErrorAlert = false;

    this.makes = [];
    this.models = [];
    this.categories = [];
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

    if(data.requireVIN === 1) {
      this.isVinRequire = true;
    } else {
      this.isVinRequire = false;
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

  initForm() {
    this.getVehicleForm = new FormGroup({
      year: new FormControl(null, [
        <any>Validators.required
      ]),
      make: new FormControl(null, [
        <any>Validators.required
      ]),
      model: new FormControl(null, [
        <any>Validators.required
      ]),
      category: new FormControl(null, [
        <any>Validators.required
      ])
    });
  }

	ngOnInit() {
    this._dataService.get('v1/vehicle/years')
      .subscribe((res: any) => {
        this.years = [];
        for(let key in res.data.years) {
          let value = parseInt(res.data.years[key]);
          this.years.push({value: key, label: value});
        }

        this.years.sort(function(a: any, b: any) {
          return parseInt(b.label) - parseInt(a.label);
        });

        this.initForm();
        this._spinner.stop();
        this.pageLoading = false;
      }, (error: any) => console.error('Unable to fetch brands', error));

    this.isPageLoading = false;
    this._spinner.start();
	    this.sub = this.route.params.subscribe(params=> {
	    	this.zipcode = params['zipcode'];
	    	this.slugId = params['slugId'];
	    });

	    this.user = {
	    	vincode: ''
	    };

	    this.vincodeNumberError = false;
      let postData = {
        code: 200,
        data: {
          slug: this.slugId
        }
      };

      this._dataService.post('v1/data/getvehicle', postData)
        .subscribe((res: any) => {
          this.initVehicleData(res.data);
          this._spinner.stop();
        }, (error: any) => console.error('Unable to fetch brands', error));

    }

    onYearsSelected(event: any) {
      let year = (event as any).value;
      this.makes = [];
      this.models = [];
      this.categories = [];
      this.claimMakeDisabled = true;
      this.claimModelDisabled = true;
      this.claimCategoryDisabled = true;
      this.nextAvailable = 1;

      if(this.nextAvailable === 3) {
        this.nextAvailable = 2;
      } else {
        this.nextAvailable = 1;
      }
      this.claimYearID = year;
      if(year === -1) {
        this.claimMakeDisabled = true;
      } else {
        this._spinner.start();
        this.claimUrl = 'v1/vehicle/makesfromdata?year=' + year;
        this._dataService.get(this.claimUrl)
          .subscribe((res: any) => {
            this.claimMakeDisabled = false;
            this.makes = res.data.map((item: any) => {
              return {value: item.make, label: item.make};
            });
            this._spinner.stop();
            }, (error: any) => console.error('Unable to fetch brands', error));
      }
    }

    onMakesSelected(event: any) {
      let make = (event as any).value;
      this.models = [];
      this.categories = [];
      this.claimModelDisabled = true;
      this.claimCategoryDisabled = true;
      this.nextAvailable = 1;

      if(parseInt(make) === -1) {
    		this.models = [];
    		this.categories = [];
    		this.claimModelID = -1;
    		this.claimCategoryID = -1;
    		this.claimModelDisabled = true;
    		this.claimCategoryDisabled = true;
    		return;
    	}
    	this._spinner.start();
    	this.claimUrl = 'v1/vehicle/modelsfromdata?year=' + this.claimYearID;
    	this.claimUrl += '&make=';
    	this.claimUrl += make;
    	this._dataService.get(this.claimUrl)
    		.subscribe((res: any) => {
          this.models = res.data.map((item: any) => {
            return {value: item.model, label: item.model};
          });
    			this.claimMakeID = make;
    			this.claimModelDisabled = false;
    			this._spinner.stop();
    		}, (error: any) => console.error('Unable to fetch brands', error));
    }

    onModelsSelected(event: any) {
      let model = (event as any).value;
      this.categories = [];
      this.claimCategoryDisabled = true;
      this.nextAvailable = 1;

    	if(parseInt(model) === -1) {
    		this.categories = [];
    		this.claimCategoryID = -1;
    		this.claimCategoryDisabled = true;
    		return;
    	}
    	this._spinner.start();
    	this.claimUrl = 'v1/vehicle/stylesfromdata?year=' + this.claimYearID;
    	this.claimUrl += '&make=';
    	this.claimUrl += this.claimMakeID;
    	this.claimUrl += '&model=';
    	this.claimUrl += model;
    	this._dataService.get(this.claimUrl)
			.subscribe((res: any) => {
				this.categories = res.data.map((item: any) => {
          return {value: item.vehicleId, label: item.style};
        });
				this.claimModelID = model;
				this.claimCategoryDisabled = false;
				this._spinner.stop();
			}, (error: any) => console.error('Unable to fetch brands', error));
    }

    onCategoriesSelected(event: any) {
      let category = (event as any).value;
    	if(parseInt(category) === -1) {
    		return;
    	}
    	if(this.nextAvailable === 0) {
    		this.nextAvailable = 1;
    	} else {
    		this.nextAvailable = 2;
    	}
    	this.claimCategoryID = category;
    	console.log(category);
    }

	keypressVin(value: any, vinform: any) {
		if((/^[a-zA-Z0-9]*$/.test(value)) === false) {
			this.vincodeNumberError = true;
			vinform.reset();
			return;
		}

		this.vincodeNumberError = false;

		if(value.toString().length === 17) {
			this._spinner.start();
      this.vinCode = value;
	    this._dataService.get('v1/vehicle/vin?vin=' + value)
				.subscribe((res: any) => {
					console.log(res);
					this.vinAvailable = true;

          this.claimCategoryID = res.data.vehicleId;
    		  this.nextAvailable = 3;
          this.years       = [{value: res.data.year, label: res.data.year}];
          this.makes       = [{value: res.data.make, label: res.data.make}];
          this.models      = [{value: res.data.model, label: res.data.model}];
          this.categories  = [{value: res.data.style, label: res.data.style}];
          this.claimMakeDisabled     = false;
          this.claimModelDisabled    = false;
          this.claimCategoryDisabled = false;
          let that = this;

          setTimeout(() => {
            that.getVehicleForm.controls['year'].setValue(res.data.year);
            that.getVehicleForm.controls['make'].setValue(res.data.make);
            that.getVehicleForm.controls['model'].setValue(res.data.model);
            that.getVehicleForm.controls['category'].setValue(res.data.style);
          }, 200);
					this._spinner.stop();
				}, (error: any) => console.error('Unable to fetch brands', error));
		} else {
      this.vinAvailable = false;
    }
	}

	loadClaim() {
    if(this.isVinRequire && !this.vinAvailable) {
      this.isVinErrorAlert = true;
      let that = this;
      setTimeout(() => { that.isVinErrorAlert = false; }, 3000);
      return;
    }

		this._spinner.start();
    let postData = {
      code: 200,
      data: {
        AutoVIN: this.vinCode,
        AutoYear: this.getVehicleForm['value']['year'],
        AutoID: this.claimCategoryID,
        slug: this.slugId
      }
    };

    this._dataService.post('v1/data/savevehicle', postData)
      .subscribe((res: any) => {
        this._storeService.set('p_slug', res.data.slug);
        this._spinner.stop();
        this.router.navigate(['/damage', res.data.slug]);
      }, (error: any) => console.error('Unable to fetch brands', error));
	}

  onVin() {
    this.modal.alert()
      .size('sm')
      .showClose(true)
      .okBtnClass('hidden')
      .title('Vin Locations')
      .body(`
          <div class="vin-modal-wrapper no-padding">
          <img src="assets/img/vin_locations.png">
          </div>
          `)
      .open();
  }
}
