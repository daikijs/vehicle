import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { WelcomeComponent }           from './welcome.component';
import { PlayerWindowModalComponent } from './modal/player.modal.component';
import { PlayerModelService }         from './modal/player.modal.service';
import { VgCoreModule }               from 'videogular2/core';
import { VgControlsModule }           from 'videogular2/controls';
import { VgBufferingModule }          from 'videogular2/buffering';
import { VgOverlayPlayModule }        from 'videogular2/overlay-play';
import { VgStreamingModule }          from 'videogular2/streaming';

@NgModule({
    imports: [
    	CommonModule,
    	VgCoreModule,
    	VgControlsModule,
    	VgBufferingModule,
    	VgOverlayPlayModule,
    	VgStreamingModule
    ],
    declarations: [WelcomeComponent,
    PlayerWindowModalComponent],
    exports: [WelcomeComponent],
    providers: [PlayerModelService],
    entryComponents: [
    	PlayerWindowModalComponent
    ]
})

export class WelcomeModule { }
