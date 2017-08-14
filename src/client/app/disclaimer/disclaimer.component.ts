import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService }  from '../shared/index';

/**
 * This class represents the lazy loaded DisclaimerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-disclaimer',
  templateUrl: 'disclaimer.component.html',
  styleUrls: ['disclaimer.component.css']
})
export class DisclaimerComponent implements OnInit {
	slugId: string;
	isLoading: boolean;
	isExistSlug: boolean;

  constructor(private route: ActivatedRoute,
  	private _spinner: SpinnerService,
  	private router: Router) {
  	this.slugId = '';
  	this.isLoading = false;
  	this.isExistSlug = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params=> {
      this.slugId = params['slug'];

      if(this.slugId) {
        this.isExistSlug = true;
        this._spinner.start();
        let that = this;
        setTimeout(function() {
        	that._spinner.stop();
	      	that.isLoading = true;
	      }, 3000);
      } else {
        this.isLoading = true;
      }
    });
  }

  next() {
  	this.router.navigate(['/estimate', this.slugId]);
  }
}
