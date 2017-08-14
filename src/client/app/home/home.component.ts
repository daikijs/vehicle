import { Component, OnInit } from '@angular/core';
import { DataService }  from '../core/data.service';
import { StoreService }  from '../core/store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SpinnerService }  from '../shared/index';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {

  errorMessage: string;
  names: any[] = [];
  claimID: number;
  profile_slug: string;

  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   */
  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private _spinner: SpinnerService,
    private _storeService: StoreService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.claimID = 194948;
    this.route.params.subscribe(params=> {
      this.profile_slug = params['profile_slug'];
    });
  }

  next(form:any) {
    if(form.value.claimID) {
      this._spinner.start();

      let postData = {
        code: 200,
        data: {
          profile_slug: form.value.profile_slug,
          Customer_Zip: 91701,
          ClaimID: form.value.claimID
        }
      };

      this._dataService.post('v1/data/getclaim', postData)
        .subscribe((res: any) => {
          // get the slug
          this._spinner.stop();
          this._storeService.setTempData(res.data);
          this._storeService.set('p_slug', res.data.slug);
          this.router.navigate(['/vehicle', res.data.slug]);
        });
    } else {
      alert('Please insert claim ID.');
    }
  }

}
