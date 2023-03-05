import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOnDuty, NewOnDuty } from '../on-duty.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOnDuty for edit and NewOnDutyFormGroupInput for create.
 */
type OnDutyFormGroupInput = IOnDuty | PartialWithRequiredKeyOf<NewOnDuty>;

type OnDutyFormDefaults = Pick<NewOnDuty, 'id'>;

type OnDutyFormGroupContent = {
  id: FormControl<IOnDuty['id'] | NewOnDuty['id']>;
  dutyNo: FormControl<IOnDuty['dutyNo']>;
  staff: FormControl<IOnDuty['staff']>;
  transport: FormControl<IOnDuty['transport']>;
};

export type OnDutyFormGroup = FormGroup<OnDutyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OnDutyFormService {
  createOnDutyFormGroup(onDuty: OnDutyFormGroupInput = { id: null }): OnDutyFormGroup {
    const onDutyRawValue = {
      ...this.getFormDefaults(),
      ...onDuty,
    };
    return new FormGroup<OnDutyFormGroupContent>({
      id: new FormControl(
        { value: onDutyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dutyNo: new FormControl(onDutyRawValue.dutyNo),
      staff: new FormControl(onDutyRawValue.staff, {
        validators: [Validators.required],
      }),
      transport: new FormControl(onDutyRawValue.transport, {
        validators: [Validators.required],
      }),
    });
  }

  getOnDuty(form: OnDutyFormGroup): IOnDuty | NewOnDuty {
    return form.getRawValue() as IOnDuty | NewOnDuty;
  }

  resetForm(form: OnDutyFormGroup, onDuty: OnDutyFormGroupInput): void {
    const onDutyRawValue = { ...this.getFormDefaults(), ...onDuty };
    form.reset(
      {
        ...onDutyRawValue,
        id: { value: onDutyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OnDutyFormDefaults {
    return {
      id: null,
    };
  }
}
