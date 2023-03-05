import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BulletinDetailComponent } from './bulletin-detail.component';

describe('Bulletin Management Detail Component', () => {
  let comp: BulletinDetailComponent;
  let fixture: ComponentFixture<BulletinDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulletinDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bulletin: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BulletinDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BulletinDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bulletin on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bulletin).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
