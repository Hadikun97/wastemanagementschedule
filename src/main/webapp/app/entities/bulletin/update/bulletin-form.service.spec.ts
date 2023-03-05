import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bulletin.test-samples';

import { BulletinFormService } from './bulletin-form.service';

describe('Bulletin Form Service', () => {
  let service: BulletinFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulletinFormService);
  });

  describe('Service methods', () => {
    describe('createBulletinFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBulletinFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            name: expect.any(Object),
            contactNo: expect.any(Object),
          })
        );
      });

      it('passing IBulletin should create a new form with FormGroup', () => {
        const formGroup = service.createBulletinFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            name: expect.any(Object),
            contactNo: expect.any(Object),
          })
        );
      });
    });

    describe('getBulletin', () => {
      it('should return NewBulletin for default Bulletin initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBulletinFormGroup(sampleWithNewData);

        const bulletin = service.getBulletin(formGroup) as any;

        expect(bulletin).toMatchObject(sampleWithNewData);
      });

      it('should return NewBulletin for empty Bulletin initial value', () => {
        const formGroup = service.createBulletinFormGroup();

        const bulletin = service.getBulletin(formGroup) as any;

        expect(bulletin).toMatchObject({});
      });

      it('should return IBulletin', () => {
        const formGroup = service.createBulletinFormGroup(sampleWithRequiredData);

        const bulletin = service.getBulletin(formGroup) as any;

        expect(bulletin).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBulletin should not enable id FormControl', () => {
        const formGroup = service.createBulletinFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBulletin should disable id FormControl', () => {
        const formGroup = service.createBulletinFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
