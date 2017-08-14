import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http, HttpModule,
  XHRBackend
} from '@angular/http';
import {
  ViewContainerRef
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ToolbarComponent }    from './toolbar.component';
import { EventService }        from '../../core/event.service';
import { DataService }         from '../../core/data.service';
import { DisplayModelService } from '../../core/modal/display/display.modal.service';
import { SpinnerService }      from '../spinner/spinner.service';

import { MockBackend } from '@angular/http/testing';

export function main() {
   describe('Toolbar component', () => {
    let fixture: any;
    let tbInstance: any;
    let mockDataService: any;
    let mockModalService: any;

    let mockData =  {
      _body: 'body',
      status: 200
    };

    let mockModalData = {
      result: Promise.resolve(true)
    };

    beforeEach(async(() => {

      TestBed.configureTestingModule({
        imports: [
          HttpModule
        ],
        providers: [
          ViewContainerRef,
          EventService,
          { provide: DataService, useValue: new MockDataService() },
          SpinnerService,
          { provide: DisplayModelService, useValue: new MockModalService() },
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory:
              (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                  return new Http(backend, defaultOptions);
              }
           }
        ],
        declarations: [
          ToolbarComponent
        ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        tbInstance = fixture.debugElement.componentInstance;

        mockDataService = fixture.debugElement.injector.get(DataService) as MockDataService;
        spyOn(mockDataService, 'get').and.callThrough();
        mockDataService.returnValue = mockData;

        spyOn(mockDataService, 'post').and.callThrough();
        mockDataService.returnValue = mockData;

        mockModalService = fixture.debugElement.injector.get(DisplayModelService) as MockModalService;
        spyOn(mockModalService, 'openDialog').and.callThrough();
        mockModalService.returnValue = mockModalData;
      });
    }));

    it('displayLink function should work',
      async(() => {
        tbInstance.displayLink();
        expect(tbInstance._displayModal.openDialog).toHaveBeenCalled();
      }));

  });
}

class MockDataService {

  returnValue: Object;

  get(url:string='', b: boolean=false): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }

  post(url:string='', postdata: any={}): Observable<Object> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}

class MockModalService {
  returnValue: Object;

  openDialog(displayData: string, viewContainer:ViewContainerRef): Promise<Object> {
    return Promise.resolve(this.returnValue);
  }
}
