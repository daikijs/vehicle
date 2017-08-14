import { Component,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  OnInit } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { ActivatedRoute } from '@angular/router';
import { DataService }  from '../../core/data.service';
import { StoreService }  from '../../core/store.service';
import { DamageModalContent } from './damage-modal-content';
import { DamageLocationComponent } from '../damage-location.component';
import { SpinnerService }  from '../../shared/index';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'modal-content',
  templateUrl: 'damage.modal.component.html',
  styleUrls: ['damage.modal.component.css']
})

export class DamageWindowModalComponent implements ModalComponent<DamageModalContent>, OnInit {
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    @ViewChild(DamageLocationComponent) myDamageLocation: DamageLocationComponent;
    context: DamageModalContent;
    autoPartID: number;
    damageList: Object[];
    damageData: Object;
    selectedImg: any;
    questionType: number; // question type in pop modal
    levelMin: number;
    levelMax: number;
    damageQuestionData: any;
    damageLevel: number;
    questionOption: number;
    selectedQuestionId: number;


    modalHeader: string;
    modalDescription: string;
    questions: string[];
    isTextQuestionType: boolean;

    imageMap: any;
    damageLocation: number[];
    host: any;
    selectedDamageLocation: boolean;
    imgLoadCount: number = 0;
    loadImgTotal: number = 0;
    modalE: any = null;
    previousQuestionType: number; // previous question type
    helperContent: string; // helper content
    selectedLevel: number; // the level selected by clicking the damage image
    slug: string;
    val: number = 2;
    isChecked:boolean = true;

    constructor(
      public dialog: DialogRef<DamageModalContent>,
      private _dataService: DataService,
      private _storeService: StoreService,
      private route: ActivatedRoute,
      private _spinner: SpinnerService,
      private _rootNode: ElementRef
    ) {
      this.damageQuestionData = {
        answer:'',
        message: '',
        callback: ''
      };
      this.context                = dialog.context;
      this.autoPartID             = dialog.context.autoPartID;
      this.imageMap               = dialog.context.carMap.carImgMap;
      this.questionType           = 0;
      this.levelMin               = 0;
      this.levelMax               = 0;
      this.questionOption         = -1;
      this.damageLevel            = -1;
      this.selectedLevel          = -1;
      this.previousQuestionType   = -1;
      this.damageLocation         = [];
      this.helperContent          = '';
      this.damageData             = {};
      this.selectedDamageLocation =false;
    }

    ngOnInit() {
      this.modalE = $(this._rootNode.nativeElement).closest('.modal');
      this.hideModal();

      this.route.params.subscribe(params=> {
        this.slug = params['id'];
        let postData = {
          code: 200,
          data: {
            slug: this.slug,
            autoPartID: this.autoPartID
          }
        };

        this._dataService.post('v1/data/autopart', postData)
          .subscribe((res: any) => {
            this.host = this._dataService.host;
            if(res.data.callback === 'saveautopartquestion') {
              this.damageQuestionData = res.data;
              if((this.damageQuestionData as any).answer[0].img) {
                this.isTextQuestionType = false;
                this.selectedQuestionId = -1;
              } else {
                this.isTextQuestionType = true;
              }
              this.questionType = 3;
            } else {
              this.damageList = res.data.option;
              this.selectedImg = this.damageList[0];
              this.modalHeader = res.data.header;
              this.modalDescription = res.data.desc;
              this.questionType = 1;
              this.loadImgTotal = this.damageList.length;
              let answers = res.data.option.map((element: any) => {
                return element.answer;
              });
              let result = this.getMinMax(answers);
              this.levelMin = result[0];
              this.levelMax = result[1];
              this.selectedLevel = parseInt(res.data.selected);
              this.displayCurrentStep(this.selectedLevel);
            }

            this.showModal();
          }, (error: any) => console.error('Unable to fetch brands', error));

      });
    }

    getMinMax(data: number[]) {
      let max = Math.max.apply(Math, data);
      let min = Math.min.apply(Math, data);
      return [min, max];
    }

    hideModal(count=0) {
      if(this.modalE.length <= 0) {
        count ++;
        let that = this;
        setTimeout(function() {
          that.hideModal(count);
        });
      } else if(count>50) {
        console.log('Fail to loading the modal.');
      } else {
        this._spinner.start();
        this.modalE.hide();
      }
    }

    showModal() {
      this.modalE.show();
      this._spinner.stop();
    }

    closeModal() {
      this.context.carMap.markList.splice(-1, 1);
      this.dialog.close();
    }

    onChangeSlider(event: any) {
      this.displayCurrentStep((event as any).value);
    }

    /*
    display available step
    params:
    - level: damage level(counter) 
    */
    displayCurrentStep(level: number, count: number = 0) {
      this.selectedLevel = level;
      let stepClass = '#damage_modal .step';
      let availableStepClass = stepClass + '.step';
      availableStepClass += level;
      if($(stepClass).length <= 0) {
        count ++;
        let that = this;
        setTimeout(function() {
          that.displayCurrentStep(level, count);
        }, 50);
      } else if(count>50) {
        console.log('Fail to loading the step damage images.');
      } else {
        $(stepClass).hide();
        $(availableStepClass).show();
      }

    }

    /*
    go to next level of damaged images
    params:
    - level: damage level 
    */
    nextLevel(level: number) {
      level ++;
      if(level > this.loadImgTotal) {
        level = this.levelMin;
      } else {
        level += this.levelMin;
      }
      this.displayCurrentStep(level);
    }

    /*
    go to previous level of damaged images
    params:
    - level: damage level 
    */
    previousLevel(level: number) {
      level --;
      if(level < 0) {
        level = this.levelMax;
      } else {
        level += this.levelMin;
      }
      this.displayCurrentStep(level);
    }

    /*
    show helper text
    params:
    - level: damage level 
    */
    helper() {
      this.previousQuestionType = this.questionType;
      this.questionType = 4;console.log(this.selectedLevel);
      this.helperContent = (this.damageList[this.selectedLevel-1] as any).help;
    }

    /*
    close helper modal
    params:
    - questionType: previous question type 
    */
    closeHelper(questionType: number = 0) {
      if(questionType === 0) {
        this.questionType = this.previousQuestionType;
      } else {
        this.questionType = questionType;
      }

      this.displayCurrentStep(this.selectedLevel);
    }

    loadImg() {
      this.imgLoadCount ++;
      if(this.imgLoadCount >= this.loadImgTotal) {
        this.imgLoadCount = 0;
      }
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

    clickDoorDamage(door: Object, index: number) {console.log(index);
      this.selectedImg = door;

      this.damageLevel = (door as any).answer;
      $('.autopart-area > .step').css('border', 'none');
      this.previousQuestionType = this.questionType;
      this.questionType = 5;
    }

    damageFinalized() {
      this.hideModal();
      this.questionType = 0;
      let postData = {
        code: 200,
        data: {
          slug: this.slug,
          autoPartID: this.autoPartID,
          damageLevel: this.damageLevel
        }
      };

      this._dataService.post('v1/data/savedamagelevel', postData)
        .subscribe((res: any) => {
          if(res.data.callback === 'saveautopartquestion') {
            if(res.data.message === 'No more questions.') {
              this.dialog.close();
              this.waitForDMClose(1);
            } else {
              this.questionType = 3;
            }
          } else {
            this.questionType = 2;
            this.damageData = res;
            this.modalHeader = res.data.header;
            this.modalDescription = res.data.desc;
            this.host = this._dataService.host;
          }
          this.showModal();
        }, (error: any) => console.error('Unable to fetch brands', error));
    }

    /*
    insert the answer to the list
    */
    insertAnswerToList($event: any) {
      for(let i=0; i<this.damageLocation.length; i++) {
        if($event.id === (this.damageLocation[i] as any).id) {
          this.damageLocation.splice(i, 1);
          return false;
        }
      }

      this.damageLocation.push($event);
      return true;
    }

    /*
    get answer by clicking answer
    */
    getLocationAnswer($event: any) {
      this.insertAnswerToList($event);
      this.myDamageLocation.updateLocation(this.damageLocation);

      if(this.damageLocation.length > 0) {
        this.selectedDamageLocation = true;
      } else {
        this.selectedDamageLocation = false;
      }
    }

    damageAreaFinalized() {
      this.hideModal();
      // this.questionType = 0;
      let damageLocationAnswerArray: any[] = [];
      for(let i=0; i<this.damageLocation.length; i++) {
        let resItem = <any>{};
        resItem['id'] = (this.damageLocation[i] as any).answer['data']['Answer'];
        if((this.damageLocation[i] as any).answer['intersect']) {
          resItem['intersects'] = (this.damageLocation[i] as any).answer['intersect'];
        }
        damageLocationAnswerArray.push(resItem);
      }

      let postData = {
        code: 200,
        data: {
          slug: this.slug,
          autoPartId: this.autoPartID,
          damageLocation: damageLocationAnswerArray
        }
      };

      this._dataService.post('v1/data/savedamagelocation', postData)
        .subscribe((res: any) => {
          this.damageQuestionData = res.data;
          if(this.damageQuestionData.message === 'No more questions.') {
            this.dialog.close();
            this.waitForDMClose(0);
          } else {
            this.questionType = 3;
            if((this.damageQuestionData as any).answer[0].img) {
              this.isTextQuestionType = false;
              this.selectedQuestionId = -1;
            } else {
              this.isTextQuestionType = true;
            }
            this.questions = res.data.answer;
          }
          this.showModal();
        }, (error: any) => console.error('Unable to fetch brands', error));
    }

    // wait for closing the damage modal
    waitForDMClose(nType:number, count: number = 0) {
      if(count > 30) {
        console.log('Timeout to wait for the damage modal close event');
      } else if(!this.context.carMap._damageModelService.bClose) {
        count ++;
        setTimeout(() => this.waitForDMClose(nType, count), 50);
      } else {
        if(nType === 0) {
          this.imageMap.displayCheckMark();
        } else {
          this.imageMap.updatePolygon(this.context.carMap.markList);
          this.imageMap.updateCheckMark(this.context.carMap.markList);
          this.imageMap.displayCheckMark();
        }
      }
    }

    selectAnswer(id: any) {
      this.questionOption = id;
      this.selectedQuestionId = id;
    }

    onChangeState(event: any) {
      if((event as any).currentValue) {
        this.questionOption = this.getQuestionId('yes');
      } else {
        this.questionOption = this.getQuestionId('no');
      }
    }

    getQuestionId(state: string) {
      let answerList = (this.damageQuestionData as any).answer.filter(function(e: any) {
        return e.text.toLowerCase() === state;
      });

      return (answerList[0] as any).id;
    }

    damageQuestionsFinalized(funcName: string) {
      this.hideModal();
      this.questionType = 0;
      let postData = {
        code: 200,
        data: {
          slug: this.slug,
          autoPartId: this.autoPartID,
          questionId: this.damageQuestionData.questionId,
          answerId: this.questionOption,
          claimDamageQuestionId: this.damageQuestionData.claimDamageQuestionId
        }
      };

      this._dataService.post('v1/data/saveautopartquestion', postData)
        .subscribe((res: any) => {
          this.showModal();
          this.damageQuestionData = res.data;
          if(this.damageQuestionData.message === 'No more questions.') {
            this.dialog.close();
            this.waitForDMClose(1);
          } else {
            this.questionType = 3;
            this.questionOption = -1;
          }
        }, (error: any) => console.error('Unable to fetch brands', error));
    }
}
