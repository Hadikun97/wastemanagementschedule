import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStaff, NewStaff } from '../staff.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStaff for edit and NewStaffFormGroupInput for create.
 */
type StaffFormGroupInput = IStaff | PartialWithRequiredKeyOf<NewStaff>;

type StaffFormDefaults = Pick<NewStaff, 'id'>;

type StaffFormGroupContent = {
  id: FormControl<IStaff['id'] | NewStaff['id']>;
  regNo: FormControl<IStaff['regNo']>;
  license: FormControl<IStaff['license']>;
  gender: FormControl<IStaff['gender']>;
  name: FormControl<IStaff['name']>;
  address: FormControl<IStaff['address']>;
  contactNo: FormControl<IStaff['contactNo']>;
};

export type StaffFormGroup = FormGroup<StaffFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StaffFormService {
  createStaffFormGroup(staff: StaffFormGroupInput = { id: null }): StaffFormGroup {
    const staffRawValue = {
      ...this.getFormDefaults(),
      ...staff,
    };
    return new FormGroup<StaffFormGroupContent>({
      id: new FormControl(
        { value: staffRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      regNo: new FormControl(staffRawValue.regNo, {
        validators: [Validators.maxLength(10)],
      }),
      license: new FormControl(staffRawValue.license),
      gender: new FormControl(staffRawValue.gender),
      name: new FormControl(staffRawValue.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      address: new FormControl(staffRawValue.address, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      contactNo: new FormControl(staffRawValue.contactNo, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
    });
  }

  getStaff(form: StaffFormGroup): IStaff | NewStaff {
    return form.getRawValue() as IStaff | NewStaff;
  }

  resetForm(form: StaffFormGroup, staff: StaffFormGroupInput): void {
    const staffRawValue = { ...this.getFormDefaults(), ...staff };
    form.reset(
      {
        ...staffRawValue,
        id: { value: staffRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StaffFormDefaults {
    return {
      id: null,
    };
  }
}
