import { Component, Input, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModelService } from './modal/alert.modal.service';
import { DataService }  from '../core/data.service';
import { StoreService }  from '../core/store.service';

/**
 * This class represents the lazy loaded DamageComponent.
 */

@Component({
  moduleId: module.id,
  selector: 'sd-damage',
  templateUrl: 'damage.component.html',
  styleUrls: ['damage.component.css']
})

export class DamageComponent implements OnInit, OnDestroy {
	slug: string;
	sub: any;
  boolNextAbility: boolean;
  isLoading: boolean;
  _modal: any;

  totoalStep: number;
  currentStep: number;
  @Input('product') product: any;

	constructor(
    private activeRoute: ActivatedRoute,
    private _data: DataService,
    private router: Router,
    private _storeService: StoreService,
    private _viewContainer: ViewContainerRef,
    private _alertModelService: AlertModelService
  ) {
    this.boolNextAbility = false;
    this.isLoading = false;
  }

	ngOnInit() {
    // activeRoute param
    this.sub = this.activeRoute.params.subscribe(params=> {
      this.slug = params['id'];
      this._alertModelService.openDialog('0', this._viewContainer);
    });
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  checkNextAbility($event: any) {
    if ($event) {
      this._alertModelService.openDialog(this.slug, this._viewContainer);
      this.boolNextAbility = true;
    }
  }

  next() {
    this.router.navigate(['/photo', this.slug]);
  }

  getData(event: any) {
    this.totoalStep = event.totalStep;
    this.currentStep = event.currentStep;
    this.isLoading = true;
  }
}
