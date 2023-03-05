import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBulletin, NewBulletin } from '../bulletin.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBulletin for edit and NewBulletinFormGroupInput for create.
 */
type BulletinFormGroupInput = IBulletin | PartialWithRequiredKeyOf<NewBulletin>;

type BulletinFormDefaults = Pick<NewBulletin, 'id'>;

type BulletinFormGroupContent = {
  id: FormControl<IBulletin['id'] | NewBulletin['id']>;
  title: FormControl<IBulletin['title']>;
  description: FormControl<IBulletin['description']>;
  name: FormControl<IBulletin['name']>;
  contactNo: FormControl<IBulletin['contactNo']>;
};

export type BulletinFormGroup = FormGroup<BulletinFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BulletinFormService {
  createBulletinFormGroup(bulletin: BulletinFormGroupInput = { id: null }): BulletinFormGroup {
    const bulletinRawValue = {
      ...this.getFormDefaults(),
      ...bulletin,
    };
    return new FormGroup<BulletinFormGroupContent>({
      id: new FormControl(
        { value: bulletinRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(bulletinRawValue.title, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      description: new FormControl(bulletinRawValue.description, {
        validators: [Validators.required],
      }),
      name: new FormControl(bulletinRawValue.name, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      contactNo: new FormControl(bulletinRawValue.contactNo, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
    });
  }

  getBulletin(form: BulletinFormGroup): IBulletin | NewBulletin {
    return form.getRawValue() as IBulletin | NewBulletin;
  }

  resetForm(form: BulletinFormGroup, bulletin: BulletinFormGroupInput): void {
    const bulletinRawValue = { ...this.getFormDefaults(), ...bulletin };
    form.reset(
      {
        ...bulletinRawValue,
        id: { value: bulletinRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BulletinFormDefaults {
    return {
      id: null,
    };
  }
}
