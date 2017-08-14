import {
	Component,
	OnDestroy,
	ViewContainerRef
} from '@angular/core';
import { EventService }        from '../../core/event.service';
import { DataService }         from '../../core/data.service';
import { DisplayModelService } from '../../core/modal/display/display.modal.service';
import { SpinnerService }      from '../spinner/spinner.service';

export interface IEventListenr extends OnDestroy {
    ngOnDestroy(): void;
}


/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent implements IEventListenr, OnDestroy {
	isPageLoading: boolean;
	isHelp: boolean;
	isLiveHelp: boolean;
	isDropDown: boolean;

	helpIcon: string;
	liveHelpIcon: string;
	logoIcon: string;

	helpLinks: Object[];

	constructor(
		private _dataService: DataService,
		private _eventService: EventService,
		private _displayModal: DisplayModelService,
		private _viewContainer: ViewContainerRef,
		private _spinner: SpinnerService
		) {
		this.isPageLoading = false;
		this.isDropDown = false;

		this._eventService.registerEvent('load_topbar_data', this, (args: any) => {
			let data = args[0];
			this.isHelp = data.helpStatus;
			this.isLiveHelp = data.liveHelpStatus;
			this.helpIcon = data.helpIcon;
			this.liveHelpIcon = data.liveHelpIcon;
			this.logoIcon = data.logoIcon;
			this.isPageLoading = true;
			this.helpLinks = data.helpLink;
		});
	}

	ngOnDestroy() {
		this._eventService.unregisterEvent('load_topbar_data', this);
	}

	drop() {
		this.isDropDown = this.isDropDown ? false : true;
	}

	displayLink(link: string) {
		this._spinner.start();
		this.drop();
		this._dataService.get(link, false)
            .subscribe((res: any) => {
              if(res.status === 200) {
              	this._spinner.stop();
              	this._displayModal.openDialog(res._body, this._viewContainer);
              }
            }, (error: any) => console.error('Unable to fetch brands', error));
	}
}

