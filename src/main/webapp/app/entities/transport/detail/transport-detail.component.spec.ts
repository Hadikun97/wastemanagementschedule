import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TransportDetailComponent } from './transport-detail.component';

describe('Transport Management Detail Component', () => {
  let comp: TransportDetailComponent;
  let fixture: ComponentFixture<TransportDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ transport: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TransportDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TransportDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load transport on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.transport).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
