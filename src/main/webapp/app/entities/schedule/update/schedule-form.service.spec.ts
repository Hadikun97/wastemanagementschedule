import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../schedule.test-samples';

import { ScheduleFormService } from './schedule-form.service';

describe('Schedule Form Service', () => {
  let service: ScheduleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleFormService);
  });

  describe('Service methods', () => {
    describe('createScheduleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createScheduleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            area: expect.any(Object),
            region: expect.any(Object),
            state: expect.any(Object),
            activity: expect.any(Object),
            date: expect.any(Object),
            day: expect.any(Object),
            onDuty: expect.any(Object),
          })
        );
      });

      it('passing ISchedule should create a new form with FormGroup', () => {
        const formGroup = service.createScheduleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            area: expect.any(Object),
            region: expect.any(Object),
            state: expect.any(Object),
            activity: expect.any(Object),
            date: expect.any(Object),
            day: expect.any(Object),
            onDuty: expect.any(Object),
          })
        );
      });
    });

    describe('getSchedule', () => {
      it('should return NewSchedule for default Schedule initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createScheduleFormGroup(sampleWithNewData);

        const schedule = service.getSchedule(formGroup) as any;

        expect(schedule).toMatchObject(sampleWithNewData);
      });

      it('should return NewSchedule for empty Schedule initial value', () => {
        const formGroup = service.createScheduleFormGroup();

        const schedule = service.getSchedule(formGroup) as any;

        expect(schedule).toMatchObject({});
      });

      it('should return ISchedule', () => {
        const formGroup = service.createScheduleFormGroup(sampleWithRequiredData);

        const schedule = service.getSchedule(formGroup) as any;

        expect(schedule).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISchedule should not enable id FormControl', () => {
        const formGroup = service.createScheduleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSchedule should disable id FormControl', () => {
        const formGroup = service.createScheduleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
