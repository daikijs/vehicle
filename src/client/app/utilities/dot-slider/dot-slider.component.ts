import {
    Component,
    Input,
    OnInit,
    OnChanges,
    ElementRef } from '@angular/core';
declare let $: any;

/**
 * This class represents the lazy loaded DotSliderComponent.
 */

@Component({
    moduleId: module.id,
    selector: 'dot-slider',
    templateUrl: 'dot-slider.component.html',
    styleUrls: ['dot-slider.component.css']
})

export class DotSliderComponent implements OnInit, OnChanges {
    @Input() sliderCount: number;
    @Input() currentSliderCounter: number;

    isPageLoading: boolean;

    sliderCounters: number[];
    sliderBgColors: string[];
    el: ElementRef;

    constructor(el: ElementRef) {
        this.sliderCounters = [];
        this.sliderBgColors = [];
        this.el = el;
        this.isPageLoading = false;
    }

    ngOnInit() {
        this.isPageLoading = false;
        if(this.sliderCount && this.currentSliderCounter) {
            this.isPageLoading = true;
            this.initSlider(this.sliderCount, this.currentSliderCounter);
        }
    }

    ngOnChanges() {console.log(this.currentSliderCounter, this.sliderCount);
        this.isPageLoading = false;
        if(this.sliderCount && this.currentSliderCounter) {
            this.isPageLoading = true;
            this.initSlider(this.sliderCount, this.currentSliderCounter);
        }
    }

    initSlider(totalCount: number, currentCouter: number) {
        let sliderW = this.el.nativeElement.querySelector('.dot-wrapper').offsetWidth;
        let stepW = sliderW / (totalCount-1);

        let eleLeft = -6;
        for(let i=0; i<totalCount; i++) {
            this.sliderCounters[i] = eleLeft + stepW * i;
            if(currentCouter > i) {
                this.sliderBgColors[i] = '#3497fd';
            } else {
                this.sliderBgColors[i] = '';
            }
        }
    }
}
