import { Component,
  OnInit
} from '@angular/core';
import { Router,
NavigationStart } from '@angular/router';
import { StoreService }      from '../core/store.service';
import { DomSanitizer }      from '@angular/platform-browser';
import { EventService }      from '../core/event.service';
declare var $: any;

/**
 * This class represents the lazy loaded MoreComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-more',
  templateUrl: 'more.component.html',
  styleUrls: ['more.component.css']
})
export class MoreComponent implements OnInit {
  iframeLink: any;
  sub: boolean;
  title: string;

	constructor(
    private _router: Router,
    private _storeService: StoreService,
    private _eventService: EventService,
    private domSanitizer : DomSanitizer
  ) {this.sub = false;
  }

  ngOnInit() {
    this._router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.init();
      }
    });

    this.init();
  }

  init() {this.sub = true;
    let link = this._storeService.get('more_aciton_link');
    this.title = this._storeService.get('more_aciton_text');
    this.iframeLink = this.domSanitizer.bypassSecurityTrustResourceUrl(link);
    let toolbarData = this._storeService.getObject('load_topbar_data');
    if(toolbarData) {
      this._eventService.emit('load_topbar_data', toolbarData);
    }
  }
}
