import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScheduleFormService } from './schedule-form.service';
import { ScheduleService } from '../service/schedule.service';
import { ISchedule } from '../schedule.model';
import { IOnDuty } from 'app/entities/on-duty/on-duty.model';
import { OnDutyService } from 'app/entities/on-duty/service/on-duty.service';

import { ScheduleUpdateComponent } from './schedule-update.component';

describe('Schedule Management Update Component', () => {
  let comp: ScheduleUpdateComponent;
  let fixture: ComponentFixture<ScheduleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scheduleFormService: ScheduleFormService;
  let scheduleService: ScheduleService;
  let onDutyService: OnDutyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScheduleUpdateComponent],
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
      .overrideTemplate(ScheduleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScheduleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scheduleFormService = TestBed.inject(ScheduleFormService);
    scheduleService = TestBed.inject(ScheduleService);
    onDutyService = TestBed.inject(OnDutyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call OnDuty query and add missing value', () => {
      const schedule: ISchedule = { id: 456 };
      const onDuty: IOnDuty = { id: 58387 };
      schedule.onDuty = onDuty;

      const onDutyCollection: IOnDuty[] = [{ id: 99161 }];
      jest.spyOn(onDutyService, 'query').mockReturnValue(of(new HttpResponse({ body: onDutyCollection })));
      const additionalOnDuties = [onDuty];
      const expectedCollection: IOnDuty[] = [...additionalOnDuties, ...onDutyCollection];
      jest.spyOn(onDutyService, 'addOnDutyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      expect(onDutyService.query).toHaveBeenCalled();
      expect(onDutyService.addOnDutyToCollectionIfMissing).toHaveBeenCalledWith(
        onDutyCollection,
        ...additionalOnDuties.map(expect.objectContaining)
      );
      expect(comp.onDutiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const schedule: ISchedule = { id: 456 };
      const onDuty: IOnDuty = { id: 18032 };
      schedule.onDuty = onDuty;

      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      expect(comp.onDutiesSharedCollection).toContain(onDuty);
      expect(comp.schedule).toEqual(schedule);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedule>>();
      const schedule = { id: 123 };
      jest.spyOn(scheduleFormService, 'getSchedule').mockReturnValue(schedule);
      jest.spyOn(scheduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: schedule }));
      saveSubject.complete();

      // THEN
      expect(scheduleFormService.getSchedule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(scheduleService.update).toHaveBeenCalledWith(expect.objectContaining(schedule));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedule>>();
      const schedule = { id: 123 };
      jest.spyOn(scheduleFormService, 'getSchedule').mockReturnValue({ id: null });
      jest.spyOn(scheduleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedule: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: schedule }));
      saveSubject.complete();

      // THEN
      expect(scheduleFormService.getSchedule).toHaveBeenCalled();
      expect(scheduleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedule>>();
      const schedule = { id: 123 };
      jest.spyOn(scheduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scheduleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOnDuty', () => {
      it('Should forward to onDutyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(onDutyService, 'compareOnDuty');
        comp.compareOnDuty(entity, entity2);
        expect(onDutyService.compareOnDuty).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
