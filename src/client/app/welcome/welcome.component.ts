import { Component,
	OnInit,
	ViewContainerRef
} from '@angular/core';
import { Config }                 from '../shared/index';
import { DataService }            from '../core/data.service';
import { SpinnerService }         from '../shared/index';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerModelService }     from './modal/player.modal.service';
import { Modal }                  from 'angular2-modal/plugins/bootstrap';

/**
 * This class represents the lazy loaded WelcomeComponent.
 */
@Component({
	moduleId: module.id,
	selector: 'sd-welcome',
	templateUrl: 'welcome.component.html',
	styleUrls: ['welcome.component.css']
})
export class WelcomeComponent implements OnInit {
	pageHeight: number;
	isPageLoading: boolean;
	isVideoLink: boolean;

	backendApi: string;
	slugId: string;
	welcomeDescription: string;
	btnContent: string;
	logoUrl: string;
	videoLinkSrc: string;
	videoLink: string;
	callback: string;
	videoLinkText: string;

	constructor(
		private _dataService: DataService,
		private _spinner: SpinnerService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _playerModal: PlayerModelService,
		private _viewContainer: ViewContainerRef,
		private modal: Modal
	) {
		modal.overlay.defaultViewContainer = _viewContainer;
		this.pageHeight = window.innerHeight;
		this.welcomeDescription = '';
		this.btnContent = '';
		this.logoUrl = '';
		this.callback = '';
		this.backendApi = Config.API;
		this.isVideoLink = false;
	}

	ngOnInit() {
		this._activatedRoute.params.subscribe(params=> {
			this.slugId = params['slugId'];
			this.isPageLoading = false;
			this.getWelcomeData();
		});
	}

	getWelcomeData() {
		let postData = {
        	code: 200,
        	data: {
        		slug: this.slugId
        	}
        };

		this._spinner.start();
		this._dataService.post('v1/data/welcome', postData)
        	.subscribe((res: any) => {
        		let data = res.data;

        		if(data.forward) {
        			window.location.href = data.forward;
        		}

        		this.logoUrl       = this.backendApi + data.logo;
        		this.videoLinkSrc  = this.backendApi + data.video_link_src;
        		this.videoLinkText      = data.video_link_text;
        		this.welcomeDescription = data.desc;
        		this.btnContent         = data.next_btn;
        		this.callback           = data.callback;
        		this.videoLink          = data.video_link;

        		if(data.video === 0) {
        			this.isVideoLink = false;
        		} else {
        			this.isVideoLink = true;
        		}

        		this.isPageLoading = true;
        		this._spinner.stop();
        	}, (error: any) => console.error('Unable to fetch brands', error));
	}

	start() {
		let subUrl = '/' + this.callback;
		this._router.navigate([subUrl, this.slugId]);
	}

	player() {
		this._playerModal.openDialog('', this._viewContainer);
	}
}
