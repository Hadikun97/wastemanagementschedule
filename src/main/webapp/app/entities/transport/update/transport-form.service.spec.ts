import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../transport.test-samples';

import { TransportFormService } from './transport-form.service';

describe('Transport Form Service', () => {
  let service: TransportFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportFormService);
  });

  describe('Service methods', () => {
    describe('createTransportFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTransportFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            transportNo: expect.any(Object),
            regsNo: expect.any(Object),
            type: expect.any(Object),
          })
        );
      });

      it('passing ITransport should create a new form with FormGroup', () => {
        const formGroup = service.createTransportFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            transportNo: expect.any(Object),
            regsNo: expect.any(Object),
            type: expect.any(Object),
          })
        );
      });
    });

    describe('getTransport', () => {
      it('should return NewTransport for default Transport initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTransportFormGroup(sampleWithNewData);

        const transport = service.getTransport(formGroup) as any;

        expect(transport).toMatchObject(sampleWithNewData);
      });

      it('should return NewTransport for empty Transport initial value', () => {
        const formGroup = service.createTransportFormGroup();

        const transport = service.getTransport(formGroup) as any;

        expect(transport).toMatchObject({});
      });

      it('should return ITransport', () => {
        const formGroup = service.createTransportFormGroup(sampleWithRequiredData);

        const transport = service.getTransport(formGroup) as any;

        expect(transport).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITransport should not enable id FormControl', () => {
        const formGroup = service.createTransportFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTransport should disable id FormControl', () => {
        const formGroup = service.createTransportFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
