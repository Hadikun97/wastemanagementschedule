import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UwasteFormService } from './uwaste-form.service';
import { UwasteService } from '../service/uwaste.service';
import { IUwaste } from '../uwaste.model';

import { UwasteUpdateComponent } from './uwaste-update.component';

describe('Uwaste Management Update Component', () => {
  let comp: UwasteUpdateComponent;
  let fixture: ComponentFixture<UwasteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let uwasteFormService: UwasteFormService;
  let uwasteService: UwasteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UwasteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UwasteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UwasteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    uwasteFormService = TestBed.inject(UwasteFormService);
    uwasteService = TestBed.inject(UwasteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const uwaste: IUwaste = { id: 456 };

      activatedRoute.data = of({ uwaste });
      comp.ngOnInit();

      expect(comp.uwaste).toEqual(uwaste);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUwaste>>();
      const uwaste = { id: 123 };
      jest.spyOn(uwasteFormService, 'getUwaste').mockReturnValue(uwaste);
      jest.spyOn(uwasteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uwaste });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: uwaste }));
      saveSubject.complete();

      // THEN
      expect(uwasteFormService.getUwaste).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(uwasteService.update).toHaveBeenCalledWith(expect.objectContaining(uwaste));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUwaste>>();
      const uwaste = { id: 123 };
      jest.spyOn(uwasteFormService, 'getUwaste').mockReturnValue({ id: null });
      jest.spyOn(uwasteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uwaste: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: uwaste }));
      saveSubject.complete();

      // THEN
      expect(uwasteFormService.getUwaste).toHaveBeenCalled();
      expect(uwasteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUwaste>>();
      const uwaste = { id: 123 };
      jest.spyOn(uwasteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uwaste });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(uwasteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
