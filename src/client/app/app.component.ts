import { Component } from '@angular/core';
import { Config } from './shared/index';
import { Router, NavigationStart } from '@angular/router';
import './operators';

/**
 * This class represents the main application component.
 */
@Component({
	moduleId: module.id,
	selector: 'sd-app',
	templateUrl: 'app.component.html',
})
export class AppComponent {
	currentPage: string;
	targetPageList: string[];

	constructor(router: Router) {
		console.log('Environment config', Config);
		this.currentPage = '';
		this.targetPageList = ['estimate', 'more', 'welcome'];

		router.events.subscribe(event => {
			let urlString = event.url.toString();
			if(event instanceof NavigationStart) {
				this.currentPage = '';

				if(urlString.indexOf(this.targetPageList[0]) > -1) {
					this.currentPage = this.targetPageList[0];
				}

				if(urlString.indexOf(this.targetPageList[1]) > -1) {
					this.currentPage = this.targetPageList[1];
				}

				if(urlString.indexOf(this.targetPageList[2]) > -1) {
					this.currentPage = this.targetPageList[2];
				}
			}
		});
	}
}
