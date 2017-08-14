import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService }  from '../core/data.service';
import { SpinnerService }  from '../shared/index';
import { StoreService }  from '../core/store.service';
declare var $: any;

/**
 * This class represents the lazy loaded VehicleModelComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-vehicle-model',
  templateUrl: 'vehicle_model.component.html',
  styleUrls: ['vehicle_model.component.css']
})
export class VehicleModelComponent implements OnInit {
	sub: any;
	zipcode: number;
	profile_slug: string;
	claimUrl: string;
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

	constructor(private router: Router,
		private route: ActivatedRoute,
		private _dataService: DataService,
		private _storeService: StoreService,
		private _spinner: SpinnerService) {
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

		this._dataService.get('v1/vehicle/years')
          .subscribe((res: any) => {
          	this.years = [];
            for(let key in res.data.years) {
            	let value = parseInt(res.data.years[key]);
            	this.years.push({key: key, value: value});
            }

            this.years.sort(function(a: any, b: any) {
            	return parseInt(b.value) - parseInt(a.value);
            });

            this._spinner.stop();
            this.pageLoading = false;
          }, (error: any) => console.error('Unable to fetch brands', error));
	}

	ngOnInit() {
	    this.sub = this.route.params.subscribe(params=> {
	    	this.zipcode = params['zipcode'];
	    	this.profile_slug = params['profile_slug'];
	    });

	    this.user = {
	    	vincode: ''
	    };

	    this.vincodeNumberError = false;
	}

    onChangeYear(year: any) {
    	if(this.nextAvailable === 0) {
    		this.nextAvailable = 1;
    	} else {
    		this.nextAvailable = 2;
    	}
    	this.claimYearID = year;
    	if(year === -1) {
    		this.claimMakeDisabled = true;
    	} else {
    		this._spinner.start();
    		this.claimUrl = 'v1/vehicle/makesfromdata?year=' + year;
    		this._dataService.get(this.claimUrl)
	        	.subscribe((res: any) => {
	          		this.makes = [];
	          		this.claimMakeDisabled = false;
                    this.makes = res.data;
	            	this._spinner.stop();
	          	}, (error: any) => console.error('Unable to fetch brands', error));
    	}
    }

    onChangeMake(make: any) {
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
				this.models = res.data;
				this.claimMakeID = make;
				this.claimModelDisabled = false;
				this._spinner.stop();
			}, (error: any) => console.error('Unable to fetch brands', error));
    }

    onChangeModel(model: any) {
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
				this.categories = [];
				for(let i=0; i<res.data.length; i++) {
					let value = res.data[i].style;
					let key = res.data[i].vehicleId;
					this.categories.push({key: key, value: value});
				}
				this.claimModelID = model;
				this.claimCategoryDisabled = false;
				this._spinner.stop();
			}, (error: any) => console.error('Unable to fetch brands', error));
    }

    onChangeCategory(category: any) {
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
	    	this._dataService.get('v1/vehicle/vin?vin=' + value)
				.subscribe((res: any) => {
					console.log(res);
					this.vinAvailable = true;
					this._spinner.stop();
				}, (error: any) => console.error('Unable to fetch brands', error));
		}
	}

	loadClaim(form: any) {
		let formValues = form.value;
		let nextAvailable = true;
		for(let key in formValues) {
			if(!formValues[key]) {
				nextAvailable = false;
				break;
			}
		}

		if(nextAvailable) {
			this._spinner.start();
		    let postData = {
		      code: 200,
		      data: {
		        Customer_Zip: this.zipcode,
		        AutoYear: this.claimYearID,
		        AutoID: this.claimCategoryID
		      }
		    };

		    this._dataService.post('v1/data/createclaim', postData)
		      .subscribe((res: any) => {
                this._storeService.set('p_slug', res.data.slug);
		        this._spinner.stop();
		        this.router.navigate(['/damage', res.data.slug]);
		      }, (error: any) => console.error('Unable to fetch brands', error));
		} else {
			alert('You should select all options.');
		}
	}
}
