import { Component,
    ElementRef,
    OnInit,
    ViewChild,
    Renderer
}  from '@angular/core';
import { Config }                    from '../../shared/index';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { UploadModalContent }        from './upload-modal-content';
import { Router }                    from '@angular/router';
import { FileUploader }              from 'ng2-file-upload/ng2-file-upload';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'upload.modal.component.html',
    styleUrls: ['upload.modal.component.css']
})
export class UploadWindowModalComponent implements ModalComponent<UploadModalContent>, OnInit {
    context: UploadModalContent;
    productId: any;
    fileTarget: any;

    modalType: boolean;
    isSuccessResult: boolean;

    selectedImgIndex: number;
    currentUploadIndex: number;
    uploadedCounter: number;
    progress: number;

    slug: string;
    availableModalClass: string;
    title: string;
    imgURL: string;
    currentStatus: string;
    endBtnString: string;
    backendApi: string;
    photoURL: string;
    description: string;

    STATUSES: string[];
    imgLIST: Object[];
    requiredImgLIST: Object[];
    postDataList: Object[];

    uploader: FileUploader;
    @ViewChild('fileUpload') fileUpload: ElementRef;
    @ViewChild('fileProgress') fileProgress: ElementRef;

    constructor(public dialog: DialogRef<UploadModalContent>,
        private renderer: Renderer,
        private router: Router) {
        this.context = dialog.context;
        this.backendApi = Config.API;
        this.selectedImgIndex = this.context.index;
        this.imgLIST = this.context.imgLIST;
        this.requiredImgLIST = [];
        this.requiredImgLIST.push(this.imgLIST[this.selectedImgIndex]);
        for(let i = 0; i < this.imgLIST.length; i++) {
            if(i !== this.selectedImgIndex
                && !(this.imgLIST[i] as any)['uploaded']
                && !(this.imgLIST[i] as any)['uploadStatus']) {
                this.requiredImgLIST.push(this.imgLIST[i]);
            }
        }

        this.postDataList = [];
        for(let i = 0; i < this.requiredImgLIST.length; i++) {
            this.postDataList[i] = {
                code: 200,
                data: {
                    PhotoID: (this.requiredImgLIST[i] as any).id,
                    UserID: 0,
                    slug: (this.context.postData as any).data.slug
                }
            };
        }

        console.log(this.requiredImgLIST);
        console.log(this.postDataList);

        this.currentUploadIndex = 0;
        this.uploadedCounter = 0;

        this.changeInfo(this.currentUploadIndex);

        this.STATUSES = ['selecting', 'uploading', 'done'];
        this.currentStatus = this.STATUSES[0];
        this.isSuccessResult = false;
    }

    ngOnInit() {
        this.currentUploadIndex = 0;
        this.uploader = new FileUploader({url: `${this.backendApi}/v1/data/fileupload`});

        this.uploader.onProgressAll = (progress: any) => {
            if(this.currentStatus === this.STATUSES[1]) {
                this.renderer.setElementStyle(this.fileProgress.nativeElement, 'width', progress + '%');
            }
        };

        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('data', JSON.stringify(this.postDataList[fileItem.fileIndex]));
        };

        this.uploader.onAfterAddingFile = (fileItem) => {
            fileItem.withCredentials = false;
            (fileItem as any).fileIndex = this.currentUploadIndex;
            let counter = this.imgLIST.indexOf(this.requiredImgLIST[this.currentUploadIndex]);
            (this.imgLIST[counter] as any).uploadStatus = true;
            fileItem.upload();

            this.currentUploadIndex ++;
            if(this.currentUploadIndex < this.requiredImgLIST.length) {
                this.changeInfo(this.currentUploadIndex);
            } else {
                this.currentStatus = this.STATUSES[1];
            }
        };

        this.uploader.onCompleteItem = (item: any, res: any, status: any, headers: any) => {
            let counter = this.imgLIST.indexOf(this.requiredImgLIST[item.fileIndex]);
            (this.imgLIST[counter] as any).uploadStatus = false;
            this.uploadedCounter ++;

            if(status === 500) {
                this.currentStatus = this.STATUSES[2];
                this.endBtnString = 'Fail to upload';
                this.isSuccessResult = false;
            } else {
                res = JSON.parse(res);
                (this.imgLIST[counter] as any).required       = false;
                (this.imgLIST[counter] as any).uploaded       = true;
                (this.imgLIST[counter] as any).uploadedImgUrl = res.data.path;

                if(this.uploadedCounter >= this.requiredImgLIST.length) {
                    this.currentStatus = this.STATUSES[2];
                    this.endBtnString = 'Done!';
                    this.isSuccessResult = true;
                }
            }
        };
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }

    changeInfo(index: number) {
        this.title = (this.requiredImgLIST[index] as any).text;
        this.description = (this.requiredImgLIST[index] as any).desc;
        this.imgURL = this.backendApi + (this.requiredImgLIST[index] as any).img;
    }
}
