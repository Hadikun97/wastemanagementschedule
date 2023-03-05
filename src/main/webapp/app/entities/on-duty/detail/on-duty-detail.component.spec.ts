import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OnDutyDetailComponent } from './on-duty-detail.component';

describe('OnDuty Management Detail Component', () => {
  let comp: OnDutyDetailComponent;
  let fixture: ComponentFixture<OnDutyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnDutyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ onDuty: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OnDutyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OnDutyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load onDuty on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.onDuty).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
