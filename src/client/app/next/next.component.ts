import { Component,
  ViewContainerRef,
  OnInit } from '@angular/core';
import { ActivatedRoute }         from '@angular/router';
import { Config }                 from '../shared/index';
import { DataService }            from '../core/data.service';
import { StoreService }           from '../core/store.service';
import { EventService }           from '../core/event.service';
import { NavbarService }          from '../core/navbar.service';
import { SpinnerService }         from '../shared/index';
declare var $: any;

/**
 * This class represents the lazy loaded NextComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-next',
  templateUrl: 'next.component.html',
  styleUrls: ['next.component.css']
})
export class NextComponent implements OnInit {
  loading: boolean;
  estimateData: any;
  backendApi: string;
  slug: string;

	constructor(private _dataService: DataService,
    private _storeService: StoreService,
    private activeRoute: ActivatedRoute,
    private _eventService: EventService,
    private _navbarService: NavbarService,
    private _viewContainer: ViewContainerRef,
    private _spinner: SpinnerService) {
    this.loading = false;
    this.backendApi = Config.API;

    this._spinner.start();
  }

  ngOnInit() {
    // activeRoute param
    this.activeRoute.params.subscribe(params=> {
      this.slug = params['slug'];
      this._storeService.set('slugID', this.slug);
      let postData = {
        code: 200,
        data: {
          slug: this.slug
        }
      };

      this._dataService.post('v1/estimate/next ', postData)
        .subscribe((res: any) => {console.log(res);
          let data = res.data;
          let helpIcon = this.backendApi + data.help.icon;
          let liveHelpIcon = this.backendApi + data.liveHelp.icon;
          let logoIcon = this.backendApi + data.ui.logo;
          let helpStatus: boolean, liveHelpStatus: boolean;
          if(data.liveHelp.on === 1) {
            liveHelpStatus = true;
          } else {
            liveHelpStatus = false;
          }

          if(data.help.on === 1) {
            helpStatus = true;
          } else {
            helpStatus = false;
          }

          this._eventService.emit('load_topbar_data', {
            helpIcon: helpIcon,
            helpStatus: helpStatus,
            liveHelpIcon: liveHelpIcon,
            liveHelpStatus: liveHelpStatus,
            logoIcon: logoIcon,
            helpLink: data.help.link
          });

          this._storeService.setObject('load_topbar_data',{
            helpIcon: helpIcon,
            helpStatus: helpStatus,
            liveHelpIcon: liveHelpIcon,
            liveHelpStatus: liveHelpStatus,
            logoIcon: logoIcon,
            helpLink: data.help.link
          });

          let estimateDataUrl = res.data.estimateHtml;
          let actionButtons = res.data.action.btns;
          this._navbarService.setData(actionButtons);

          this._dataService.get(estimateDataUrl, false)
            .subscribe((res: any) => {
              this.estimateData = res._body;
              this.loading = true;
              this.renderNextBodyElement();
              this._spinner.stop();
            }, (error: any) => console.error('Unable to fetch brands', error));

        }, (error: any) => console.error('Unable to fetch brands', error));
    });
  }

  renderNextBodyElement(counter: number = 0) {
    if(counter > 50) {
      console.log('Fail to load the next body element.');
    } else if($('.next-wrapper .next-body').length <= 0) {
      counter ++;
      setTimeout(() => this.renderNextBodyElement(counter), 50);
    } else {
      $('.next-wrapper .next-body').html(this.estimateData);
    }
  }
}
