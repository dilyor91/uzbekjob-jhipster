import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPersons, NewPersons } from '../persons.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPersons for edit and NewPersonsFormGroupInput for create.
 */
type PersonsFormGroupInput = IPersons | PartialWithRequiredKeyOf<NewPersons>;

type PersonsFormDefaults = Pick<NewPersons, 'id'>;

type PersonsFormGroupContent = {
  id: FormControl<IPersons['id'] | NewPersons['id']>;
  name: FormControl<IPersons['name']>;
  mobilePhone: FormControl<IPersons['mobilePhone']>;
  userId: FormControl<IPersons['userId']>;
};

export type PersonsFormGroup = FormGroup<PersonsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonsFormService {
  createPersonsFormGroup(persons: PersonsFormGroupInput = { id: null }): PersonsFormGroup {
    const personsRawValue = {
      ...this.getFormDefaults(),
      ...persons,
    };
    return new FormGroup<PersonsFormGroupContent>({
      id: new FormControl(
        { value: personsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(personsRawValue.name),
      mobilePhone: new FormControl(personsRawValue.mobilePhone),
      userId: new FormControl(personsRawValue.userId),
    });
  }

  getPersons(form: PersonsFormGroup): IPersons | NewPersons {
    return form.getRawValue() as IPersons | NewPersons;
  }

  resetForm(form: PersonsFormGroup, persons: PersonsFormGroupInput): void {
    const personsRawValue = { ...this.getFormDefaults(), ...persons };
    form.reset(
      {
        ...personsRawValue,
        id: { value: personsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PersonsFormDefaults {
    return {
      id: null,
    };
  }
}
