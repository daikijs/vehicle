import {
	Component,
	ViewChild,
	ElementRef,
	OnInit
} from '@angular/core';
import { Config }                  from '../../shared/index';
import { NavbarService }           from '../../core/navbar.service';
import { Router, NavigationStart } from '@angular/router';
import { StoreService }            from '../../core/store.service';
/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent implements OnInit {
	actionData: any[];
	actionVisible: boolean;
	isMorePage: boolean;
	isNextPage: boolean;
	isDrop: boolean;

	selectedMoreIndex: number;

	host: string;
	router: Router;
	currentUrl: string;
	slug: string;

	@ViewChild('navbarApp') navbarApp: ElementRef;

	constructor(private _navbarService: NavbarService,
		private _storeService: StoreService,
		router: Router) {
		this.actionVisible = false;
		this.isMorePage = false;
		this.isNextPage = false;
		this.isDrop = false;
		this.actionData = [];
		this.host = Config.API;
		this.slug = this._storeService.get('slugID');

		router.events.subscribe(event => {
			let urlString = event.url.toString();
			this.currentUrl = urlString;
		  	if(event instanceof NavigationStart) {
		  		this.selectedMoreIndex = -1;
		    	if(urlString.indexOf('next') > -1) {
		    		this.isNextPage = true;
		    	} else {
		    		this.isNextPage = false;
		    	}

		    	if(urlString.indexOf('more') > -1) {
		    		this.isMorePage = true;
		    		let moreIndex = this._storeService.get('current_more_index');
					this.selectedMoreIndex = parseInt(moreIndex);
		    	} else {
		    		this.isMorePage = false;
		    	}
		  	}
		});
		this.router = router;
	}

	ngOnInit() {
		this._navbarService.getEvent().subscribe(data => {
			this.actionVisible = true;
			this.actionData = data;
			for(let i=0; i<this.actionData.length;i++) {
				this.actionData[i].text = this.clearString(this.actionData[i].text);
			}
			this._storeService.setObject('action_data', this.actionData);
		});

		if(this._storeService.getObject('action_data')) {
			this.actionData = this._storeService.getObject('action_data');
		}
	}

	clearString(str: string) {
		if(str) {
			str = str.replace(/&quot;/g, '"');
		}
		return str;
	}

	next() {
	    this.isDrop = this.isDrop ? false : true;
	}

	moreAction(url: string, text: string, index: number) {
		this.selectedMoreIndex = index;
		this._storeService.set('current_more_index', index.toString());
		let link = this.host + url;
		this._storeService.set('more_aciton_text', text);
		this._storeService.set('more_aciton_link', link);
		this._storeService.set('back_aciton_link', this.currentUrl);
		this.router.navigate(['/more', this.slug]);
		this.isDrop = false;
	}

	gotoEstimate() {
		this.router.navigate(['/estimate', this.slug]);
	}

	closeDrop(event: any) {
		if(this.isDrop && (event.target === this.navbarApp.nativeElement)) {
			this.isDrop = false;
		}
	}
}
