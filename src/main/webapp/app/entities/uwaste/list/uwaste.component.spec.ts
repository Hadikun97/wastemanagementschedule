import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UwasteService } from '../service/uwaste.service';

import { UwasteComponent } from './uwaste.component';

describe('Uwaste Management Component', () => {
  let comp: UwasteComponent;
  let fixture: ComponentFixture<UwasteComponent>;
  let service: UwasteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'uwaste', component: UwasteComponent }]), HttpClientTestingModule],
      declarations: [UwasteComponent],
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
      .overrideTemplate(UwasteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UwasteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UwasteService);

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
    expect(comp.uwastes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to uwasteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUwasteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUwasteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
