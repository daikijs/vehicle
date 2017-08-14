import { NgModule }        from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule }    from '@angular/router';
import { DotSliderModule } from '../utilities/dot-slider/dot-slider.module';

import { ImgComponent }    from './img.component';
import { PhotoComponent }  from './photo.component';
import { FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { UploadWindowModalComponent }  from './modal/upload.modal.component';
import { ShowImgWindowModalComponent }  from './modal/show.img.modal.component';

import { UploadModelService } from './modal/upload.modal.service';
import { ShowImgModelService } from './modal/show.img.modal.service';

@NgModule({
    imports: [
    	CommonModule,
    	RouterModule,
    	DotSliderModule
    ],
    providers: [UploadModelService,
    ShowImgModelService],
    declarations: [
    	PhotoComponent,
    	ImgComponent,
    	UploadWindowModalComponent,
        ShowImgWindowModalComponent,
        FileSelectDirective
    ],
    exports: [PhotoComponent, RouterModule],
    entryComponents: [
    	UploadWindowModalComponent,
        ShowImgWindowModalComponent
    ]
})

export class PhotoModule { }
