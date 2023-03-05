import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUwaste, NewUwaste } from '../uwaste.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUwaste for edit and NewUwasteFormGroupInput for create.
 */
type UwasteFormGroupInput = IUwaste | PartialWithRequiredKeyOf<NewUwaste>;

type UwasteFormDefaults = Pick<NewUwaste, 'id'>;

type UwasteFormGroupContent = {
  id: FormControl<IUwaste['id'] | NewUwaste['id']>;
  description: FormControl<IUwaste['description']>;
  name: FormControl<IUwaste['name']>;
  contactNo: FormControl<IUwaste['contactNo']>;
  address: FormControl<IUwaste['address']>;
};

export type UwasteFormGroup = FormGroup<UwasteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UwasteFormService {
  createUwasteFormGroup(uwaste: UwasteFormGroupInput = { id: null }): UwasteFormGroup {
    const uwasteRawValue = {
      ...this.getFormDefaults(),
      ...uwaste,
    };
    return new FormGroup<UwasteFormGroupContent>({
      id: new FormControl(
        { value: uwasteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(uwasteRawValue.description),
      name: new FormControl(uwasteRawValue.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      contactNo: new FormControl(uwasteRawValue.contactNo, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      address: new FormControl(uwasteRawValue.address, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    });
  }

  getUwaste(form: UwasteFormGroup): IUwaste | NewUwaste {
    return form.getRawValue() as IUwaste | NewUwaste;
  }

  resetForm(form: UwasteFormGroup, uwaste: UwasteFormGroupInput): void {
    const uwasteRawValue = { ...this.getFormDefaults(), ...uwaste };
    form.reset(
      {
        ...uwasteRawValue,
        id: { value: uwasteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UwasteFormDefaults {
    return {
      id: null,
    };
  }
}
