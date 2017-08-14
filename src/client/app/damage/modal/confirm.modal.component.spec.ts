import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { DataService }  from '../../core/data.service';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogRef } from 'angular2-modal';
declare var $: any;

import { ConfirmWindowModalComponent } from './confirm.modal.component';
import { StoreService }  from '../../core/store.service';

export function main() {
   describe('Confirm Modal component', () => {
    let fixture: any;
    let confirmWindowModalComponent: any;
    let mockDataService: any;
    let mockData = {};
    let mockDialog = {
       context: {
        imgURL: 'http://imgurl.com',
        title: 'title',
        carmapHandler: {
          carImgMap: {
            updatePolygon: function(list: any[]) {
              return list;
            },
            deleteCheckMark: function(id: number) {
              return id;
            },
            updateCheckMark: function(list: any[]) {
              return list;
            }
          },
          markList: [
            {
              id: 0
            },
            {
              id: 1
            }
          ],
          doneAutoPart: function(list: any[]) {
            return list;
          }
        }
      },
      close: function(data: Object) {
        return data;
      }
    };

    beforeEach(async(() => {
      const MODAL_PROVIDERS = [
        Modal,
        Overlay,
        { provide: DialogRef, useValue: mockDialog },
        { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
      ];

      TestBed.configureTestingModule({
        imports: [
          ModalModule.forRoot()
        ],
        providers: [
          MODAL_PROVIDERS,
          StoreService,
          { provide: DataService, useValue: new MockDataService() }
        ],
        declarations: [
          ConfirmWindowModalComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ConfirmWindowModalComponent);
        confirmWindowModalComponent = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = mockData;
      });
    }));

    it('DeleteMark function should work',
      async(() => {
        confirmWindowModalComponent.markId = 0;
        confirmWindowModalComponent.markList[confirmWindowModalComponent.markId] = {
          id: 1
        };
        spyOn((<any>confirmWindowModalComponent).imgMap, 'updatePolygon');
        spyOn((<any>confirmWindowModalComponent).imgMap, 'deleteCheckMark');
        spyOn((<any>confirmWindowModalComponent).imgMap, 'updateCheckMark');
        spyOn((<any>confirmWindowModalComponent).carmapHandler, 'doneAutoPart');
        confirmWindowModalComponent.DeleteMark();
        expect((<any>confirmWindowModalComponent)._dataService.post).toHaveBeenCalled();
        expect((<any>confirmWindowModalComponent).imgMap.updatePolygon).toHaveBeenCalled();
        expect((<any>confirmWindowModalComponent).imgMap.deleteCheckMark).toHaveBeenCalled();
        expect((<any>confirmWindowModalComponent).imgMap.updateCheckMark).toHaveBeenCalled();
        expect((<any>confirmWindowModalComponent).carmapHandler.doneAutoPart).toHaveBeenCalled();
      }));
  });
}

class MockDataService {

  returnValue: Object;

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
