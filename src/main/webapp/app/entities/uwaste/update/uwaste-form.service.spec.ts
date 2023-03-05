import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../uwaste.test-samples';

import { UwasteFormService } from './uwaste-form.service';

describe('Uwaste Form Service', () => {
  let service: UwasteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UwasteFormService);
  });

  describe('Service methods', () => {
    describe('createUwasteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUwasteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            name: expect.any(Object),
            contactNo: expect.any(Object),
            address: expect.any(Object),
          })
        );
      });

      it('passing IUwaste should create a new form with FormGroup', () => {
        const formGroup = service.createUwasteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            name: expect.any(Object),
            contactNo: expect.any(Object),
            address: expect.any(Object),
          })
        );
      });
    });

    describe('getUwaste', () => {
      it('should return NewUwaste for default Uwaste initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUwasteFormGroup(sampleWithNewData);

        const uwaste = service.getUwaste(formGroup) as any;

        expect(uwaste).toMatchObject(sampleWithNewData);
      });

      it('should return NewUwaste for empty Uwaste initial value', () => {
        const formGroup = service.createUwasteFormGroup();

        const uwaste = service.getUwaste(formGroup) as any;

        expect(uwaste).toMatchObject({});
      });

      it('should return IUwaste', () => {
        const formGroup = service.createUwasteFormGroup(sampleWithRequiredData);

        const uwaste = service.getUwaste(formGroup) as any;

        expect(uwaste).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUwaste should not enable id FormControl', () => {
        const formGroup = service.createUwasteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUwaste should disable id FormControl', () => {
        const formGroup = service.createUwasteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
