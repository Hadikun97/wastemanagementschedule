import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TransportService } from '../service/transport.service';

import { TransportComponent } from './transport.component';

describe('Transport Management Component', () => {
  let comp: TransportComponent;
  let fixture: ComponentFixture<TransportComponent>;
  let service: TransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'transport', component: TransportComponent }]), HttpClientTestingModule],
      declarations: [TransportComponent],
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
      .overrideTemplate(TransportComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransportComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TransportService);

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
    expect(comp.transports?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to transportService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTransportIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTransportIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
