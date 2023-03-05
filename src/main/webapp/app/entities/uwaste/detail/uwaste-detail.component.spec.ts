import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UwasteDetailComponent } from './uwaste-detail.component';

describe('Uwaste Management Detail Component', () => {
  let comp: UwasteDetailComponent;
  let fixture: ComponentFixture<UwasteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UwasteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ uwaste: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UwasteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UwasteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load uwaste on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.uwaste).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
