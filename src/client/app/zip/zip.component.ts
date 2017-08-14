import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * This class represents the lazy loaded ZipComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-zip',
  templateUrl: 'zip.component.html',
  styleUrls: ['zip.component.css']
})
export class ZipComponent implements OnInit {
	user: any;
	profile_slug: string;

	constructor(private router: Router,
		private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params.subscribe(params=> {
	      this.profile_slug = params['profile_slug'];
	    });

		this.user = {
	      zipcode: '',
	      email: ''
	    };
	}

	next(form: any) {
		if(form.value.zipcode) {
			this.router.navigate( ['/vehicle_model/ps', this.profile_slug,
				form.value.zipcode]);
		} else {
			alert('Please insert zipcode.');
		}
	}
}
