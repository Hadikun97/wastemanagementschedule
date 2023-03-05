import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OnDutyService } from '../service/on-duty.service';

import { OnDutyComponent } from './on-duty.component';

describe('OnDuty Management Component', () => {
  let comp: OnDutyComponent;
  let fixture: ComponentFixture<OnDutyComponent>;
  let service: OnDutyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'on-duty', component: OnDutyComponent }]), HttpClientTestingModule],
      declarations: [OnDutyComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(OnDutyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OnDutyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OnDutyService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.onDuties?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to onDutyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOnDutyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOnDutyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
