import { Component,
  OnInit } from '@angular/core';
import { ActivatedRoute,
  Router } from '@angular/router';
declare let $: any;

/**
 * This class represents the lazy loaded PhotoComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-photo',
  templateUrl: 'photo.component.html',
  styleUrls: ['photo.component.css']
})

export class PhotoComponent implements OnInit {
	slugId: string;

  nextNavigation: boolean;
  isLoading: boolean;
  isNext: boolean;

  totoalStep: number;
  currentStep: number;

	constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.nextNavigation = false;
    this.isLoading = false;
    this.isNext = false;
  }

	ngOnInit() {
    this.route.params.subscribe(params=> {
      this.slugId = params['id'];
    });
  }

  next() {
    if(this.isNext) {
      this.router.navigate(['/estimate', this.slugId]);
    } else {
      $('#photo_alert').show();
      setTimeout(function() {
        $('#photo_alert').hide();
      }, 3000);
    }
  }

  getData(event: any) {
    this.totoalStep = event.totalStep;
    this.currentStep = event.currentStep;
    this.isLoading = true;
  }

  getStepStatus(event: any) {
    if(event) {
      this.isNext = true;
    } else {
      this.isNext = false;
    }
  }
}

