import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../on-duty.test-samples';

import { OnDutyFormService } from './on-duty-form.service';

describe('OnDuty Form Service', () => {
  let service: OnDutyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnDutyFormService);
  });

  describe('Service methods', () => {
    describe('createOnDutyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOnDutyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dutyNo: expect.any(Object),
            staff: expect.any(Object),
            transport: expect.any(Object),
          })
        );
      });

      it('passing IOnDuty should create a new form with FormGroup', () => {
        const formGroup = service.createOnDutyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dutyNo: expect.any(Object),
            staff: expect.any(Object),
            transport: expect.any(Object),
          })
        );
      });
    });

    describe('getOnDuty', () => {
      it('should return NewOnDuty for default OnDuty initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOnDutyFormGroup(sampleWithNewData);

        const onDuty = service.getOnDuty(formGroup) as any;

        expect(onDuty).toMatchObject(sampleWithNewData);
      });

      it('should return NewOnDuty for empty OnDuty initial value', () => {
        const formGroup = service.createOnDutyFormGroup();

        const onDuty = service.getOnDuty(formGroup) as any;

        expect(onDuty).toMatchObject({});
      });

      it('should return IOnDuty', () => {
        const formGroup = service.createOnDutyFormGroup(sampleWithRequiredData);

        const onDuty = service.getOnDuty(formGroup) as any;

        expect(onDuty).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOnDuty should not enable id FormControl', () => {
        const formGroup = service.createOnDutyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOnDuty should disable id FormControl', () => {
        const formGroup = service.createOnDutyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
