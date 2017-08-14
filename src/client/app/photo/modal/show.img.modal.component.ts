import { Component,
    OnInit,
    ElementRef,
    ViewChild,
    Renderer
}  from '@angular/core';
import { Config }                    from '../../shared/index';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { ShowImgModalContent }       from './show-img-modal-content';
import { Router }                    from '@angular/router';
import { FileUploader }              from 'ng2-file-upload/ng2-file-upload';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'show.img.modal.component.html',
    styleUrls: ['show.img.modal.component.css']
})
export class ShowImgWindowModalComponent implements ModalComponent<ShowImgModalContent>, OnInit {
    context: ShowImgModalContent;
    imgURL: string;
    title: string;
    backendApi: string;
    currentStatus: string;
    endBtnString: string;
    photoURL: string;

    isSuccessResult: boolean;

    STATUSES: string[];

    uploader: FileUploader;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @ViewChild('fileProgress') fileProgress: ElementRef;

    constructor(public dialog: DialogRef<ShowImgModalContent>,
        private renderer: Renderer,
        private router: Router) {
        this.STATUSES = ['selecting', 'uploading', 'done'];

        this.context = dialog.context;
        this.imgURL = this.context.imgURL;
        this.title = this.context.title;

        this.isSuccessResult = false;

        this.currentStatus = this.STATUSES[0];

        this.backendApi = Config.API;
    }

    ngOnInit() {
        this.uploader = new FileUploader({url: `${this.backendApi}/v1/data/fileupload`});
        this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };

        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('data', JSON.stringify(this.context.postData));
        };

        this.uploader.onProgressItem = (fileItem: any, progress: any) => {
            if(this.currentStatus === this.STATUSES[1]) {
                this.renderer.setElementStyle(this.fileProgress.nativeElement, 'width', progress + '%');
            }
        };

        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            this.currentStatus = this.STATUSES[2];

            if(status === 500) {
                this.endBtnString = 'Fail to upload';
                this.isSuccessResult = false;
                this.photoURL = null;
            } else {
                res = JSON.parse(res);
                this.photoURL = res.data.path;
                this.endBtnString = 'Done!';
                this.isSuccessResult = true;
            }
        };

        this.uploader.onAfterAddingFile = (fileItem) => {
            fileItem.withCredentials = false;
            fileItem.upload();
            this.currentStatus = this.STATUSES[1];
        };
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onClose() {
        this.dialog.close({status: true, url: this.photoURL});
    }

    onCancel() {
        this.dialog.close({status: false});
    }
}
