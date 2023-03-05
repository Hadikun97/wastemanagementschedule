import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITransport, NewTransport } from '../transport.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITransport for edit and NewTransportFormGroupInput for create.
 */
type TransportFormGroupInput = ITransport | PartialWithRequiredKeyOf<NewTransport>;

type TransportFormDefaults = Pick<NewTransport, 'id'>;

type TransportFormGroupContent = {
  id: FormControl<ITransport['id'] | NewTransport['id']>;
  transportNo: FormControl<ITransport['transportNo']>;
  regsNo: FormControl<ITransport['regsNo']>;
  type: FormControl<ITransport['type']>;
};

export type TransportFormGroup = FormGroup<TransportFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TransportFormService {
  createTransportFormGroup(transport: TransportFormGroupInput = { id: null }): TransportFormGroup {
    const transportRawValue = {
      ...this.getFormDefaults(),
      ...transport,
    };
    return new FormGroup<TransportFormGroupContent>({
      id: new FormControl(
        { value: transportRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      transportNo: new FormControl(transportRawValue.transportNo),
      regsNo: new FormControl(transportRawValue.regsNo),
      type: new FormControl(transportRawValue.type),
    });
  }

  getTransport(form: TransportFormGroup): ITransport | NewTransport {
    return form.getRawValue() as ITransport | NewTransport;
  }

  resetForm(form: TransportFormGroup, transport: TransportFormGroupInput): void {
    const transportRawValue = { ...this.getFormDefaults(), ...transport };
    form.reset(
      {
        ...transportRawValue,
        id: { value: transportRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TransportFormDefaults {
    return {
      id: null,
    };
  }
}
