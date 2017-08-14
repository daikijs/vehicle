import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';
declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'spinner-component',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  public active: boolean;
  public type: number;

  public constructor(spinner: SpinnerService) {
    spinner.status.subscribe((result: Object) => {
      this.active = (result as any).status;
      this.type = (result as any).type;
    });
  }

  ngOnInit() {
    this.setLoadGiftStyle();
  }

  setLoadGiftStyle(count: number=0) {
    if(count > 50) {
      console.log('Fail to load the loading gift');
    } else if($('.loading-spinner').length <= 0) {
      count ++;
      setTimeout(() => this.setLoadGiftStyle(count), 50);
    } else {
      let left = '';
      let top = '';
      if(this.type === 0) {
        left = '-25px';
        top = '-25px';
      } else {
        left = '-100px';
        top = '-25px';
      }
      $('.loading-spinner').css('margin-left', left);
      $('.loading-spinner').css('margin-top', top);
    }
  }
}
