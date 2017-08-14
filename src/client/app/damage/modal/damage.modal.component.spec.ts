import {
  async,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { DataService }  from '../../core/data.service';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DialogRef } from 'angular2-modal';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

import { DamageWindowModalComponent } from './damage.modal.component';
import { LevelSliderComponent }  from '../../utilities/level-slider/level-slider.component';
import { ImageMapComponent }  from '../../utilities/image-map/image-map.component';
import { DamageLocationComponent } from '../damage-location.component';
import { StoreService }  from '../../core/store.service';
import { SpinnerService }  from '../../shared/index';

export function main() {
   describe('Damage Modal component', () => {
    let fixture: any;
    let damageWindowModalComponent: any;
    let mockDataService: any;
    let mockDialog = {
       context: {
        autoPartID: 213,
        carMap: {
          carImgMap: {
            updatePolygon: function(list: any[]) {
              return list;
            },
            updateCheckMark: function(list: any) {
              return list;
            },
            displayCheckMark() {
              return true;
            }
          },
          markList: [
            {
              id: 0
            },
            {
              id: 1
            }
          ]
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
          SpinnerService,
          { provide: DataService, useValue: new MockDataService() },
          {
            provide: ActivatedRoute, useValue: {
              params: Observable.of({ id: 'id' })
            }
          },
        ],
        declarations: [
          DamageWindowModalComponent,
          LevelSliderComponent,
          DamageLocationComponent,
          ImageMapComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DamageWindowModalComponent);
        damageWindowModalComponent = fixture.debugElement.componentInstance;
        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'post').and.callThrough();
      });
    }));

    it('ngOnInit function should work',
      async(() => {
        let res = {
          data: {
            callback: 'saveautopartquestion',
            answer: [
              {
                img: 'http://img.png'
              }
            ]
          }
        };

        mockDataService.returnValue = res;
        spyOn(damageWindowModalComponent, 'hideModal');
        damageWindowModalComponent.ngOnInit();
        expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
        expect(damageWindowModalComponent.damageQuestionData).toEqual(res.data);
        expect(damageWindowModalComponent.isTextQuestionType).toEqual(false);
      }));

    it('getMinMax function should work',
      async(() => {
        let data = [10, 9, 29, 5];
        let returnedData = damageWindowModalComponent.getMinMax(data);
        expect(returnedData[0]).toEqual(5);
        expect(returnedData[1]).toEqual(29);
      }));

    it('hideModal function should work',
      async(() => {
        damageWindowModalComponent.modalE = {
          length: 1,
          hide: function() {
            console.log('hide modal');
          }
        };
        spyOn((<any>damageWindowModalComponent).modalE, 'hide');
        damageWindowModalComponent.hideModal();
        expect((<any>damageWindowModalComponent).modalE.hide).toHaveBeenCalled();
      }));

    it('showModal function should work',
      async(() => {
        damageWindowModalComponent.modalE = {
          length: 1,
          show: function() {
            console.log('show modal');
          }
        };
        spyOn((<any>damageWindowModalComponent).modalE, 'show');
        damageWindowModalComponent.showModal();
        expect((<any>damageWindowModalComponent).modalE.show).toHaveBeenCalled();
      }));

    it('closeModal function should work',
      async(() => {
        damageWindowModalComponent.context.carMap.markList = [1,2];
        damageWindowModalComponent.closeModal();
        expect(damageWindowModalComponent.context.carMap.markList.length).toEqual(1);
      }));

    it('nextLevel and previousLevel as well as closeHelper function should work',
      async(() => {
        spyOn(damageWindowModalComponent, 'displayCurrentStep');
        damageWindowModalComponent.nextLevel(1);
        expect(damageWindowModalComponent.displayCurrentStep).toHaveBeenCalled();

        damageWindowModalComponent.previousLevel(1);
        expect(damageWindowModalComponent.displayCurrentStep).toHaveBeenCalled();

        damageWindowModalComponent.closeHelper(1);
        expect(damageWindowModalComponent.displayCurrentStep).toHaveBeenCalled();
      }));

    it('damageFinalized function should work',
      async(() => {
        let res = {
          data: {
            callback: 'saveautopartquestion',
            message: 'No more questions.'
          }
        };

        mockDataService.returnValue = res;
        spyOn(damageWindowModalComponent, 'hideModal');
        spyOn(damageWindowModalComponent, 'showModal');
        spyOn((<any>damageWindowModalComponent).dialog, 'close');
        damageWindowModalComponent.damageFinalized();
        expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
        expect((<any>damageWindowModalComponent).dialog.close).toHaveBeenCalled();
        expect(damageWindowModalComponent.showModal).toHaveBeenCalled();
      }));

    it('insertAnswerToList function should work',
      async(() => {
        damageWindowModalComponent.damageLocation = [{id:0}];
        expect(damageWindowModalComponent.insertAnswerToList ({id: 0})).toEqual(false);
      }));

    it('damageAreaFinalized function should work',
      async(() => {
        let res = {
          data: {
            answer: 1,
            message: 'No more questions.'
          }
        };

        mockDataService.returnValue = res;
        spyOn(damageWindowModalComponent, 'hideModal');
        spyOn(damageWindowModalComponent, 'showModal');
        spyOn((<any>damageWindowModalComponent).imageMap, 'displayCheckMark');
        damageWindowModalComponent.damageAreaFinalized();
        expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
        expect(damageWindowModalComponent.showModal).toHaveBeenCalled();
        expect((<any>damageWindowModalComponent).imageMap.displayCheckMark).toHaveBeenCalled();
      }));

    it('onChangeState function should work',
      async(() => {
        damageWindowModalComponent.damageQuestionData.answer = [
          {
            id: 0,
            text: 'no'
          },
          {
            id: 1,
            text: 'yes'
          }
        ];
        damageWindowModalComponent.onChangeState({currentValue: 1});
        expect(damageWindowModalComponent.questionOption).toEqual(1);
      }));

    it('getQuestionId function should work',
      async(() => {
        damageWindowModalComponent.damageQuestionData.answer = [
          {
            id: 0,
            text: 'incorrect'
          },
          {
            id: 1,
            text: 'correct'
          }
        ];
        expect(damageWindowModalComponent.getQuestionId('correct')).toEqual(1);
      }));

    it('damageQuestionsFinalized function should work',
      async(() => {
        let res = {
          data: {
            answer: 1,
            message: 'No more questions.'
          }
        };

        mockDataService.returnValue = res;
        spyOn(damageWindowModalComponent, 'hideModal');
        spyOn(damageWindowModalComponent, 'showModal');
        spyOn((<any>damageWindowModalComponent).imageMap, 'displayCheckMark');
        damageWindowModalComponent.damageQuestionsFinalized('func');
        expect(damageWindowModalComponent.hideModal).toHaveBeenCalled();
        expect(damageWindowModalComponent.showModal).toHaveBeenCalled();
        expect((<any>damageWindowModalComponent).imageMap.displayCheckMark).toHaveBeenCalled();
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
