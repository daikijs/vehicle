import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { ConfirmModalContent } from './confirm-modal-content';
import { CarMapComponent } from '../carmap.component';
import { DataService }  from '../../core/data.service';
import { StoreService }  from '../../core/store.service';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    templateUrl: 'confirm.modal.component.html',
    styleUrls: ['confirm.modal.component.css']
})
export class ConfirmWindowModalComponent implements ModalComponent<ConfirmModalContent> {
    context: ConfirmModalContent;
    carmapHandler: CarMapComponent;
    imgMap: any;
    markList: any[];
    markId: number;

    constructor(public dialog: DialogRef<ConfirmModalContent>,
      private _storeService: StoreService,
      private _dataService: DataService) {
      this.carmapHandler = dialog.context.carmapHandler;
      this.imgMap = dialog.context.carmapHandler.carImgMap;
      this.markList = dialog.context.carmapHandler.markList;
      this.markId = (dialog.context as any).markId;
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    Cancel() {
        this.dialog.close();
    }

    DeleteMark() {
      let deletedId = this.markList[this.markId].id;
      let postData = {
        code: 200,
        data: {
          slug: this.carmapHandler.slug,
          autoPartID: deletedId
        }
      };

      this._dataService.post('v1/data/autopartremove', postData)
        .subscribe((res: any) => {
          this.markList.splice(this.markId, 1);
          this.imgMap.updatePolygon(this.markList);
          this.imgMap.deleteCheckMark(deletedId);
          this.imgMap.updateCheckMark(this.markList);
          this.carmapHandler.doneAutoPart(this.markList);
          this.dialog.close();
        }, (error: any) => console.error('Unable to fetch brands', error));
    }
}
