import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAuthority, NewAuthority } from '../authority.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAuthority for edit and NewAuthorityFormGroupInput for create.
 */
type AuthorityFormGroupInput = IAuthority | PartialWithRequiredKeyOf<NewAuthority>;

type AuthorityFormDefaults = Pick<NewAuthority, 'id' | 'users'>;

type AuthorityFormGroupContent = {
  id: FormControl<IAuthority['id'] | NewAuthority['id']>;
  name: FormControl<IAuthority['name']>;
  users: FormControl<IAuthority['users']>;
};

export type AuthorityFormGroup = FormGroup<AuthorityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AuthorityFormService {
  createAuthorityFormGroup(authority: AuthorityFormGroupInput = { id: null }): AuthorityFormGroup {
    const authorityRawValue = {
      ...this.getFormDefaults(),
      ...authority,
    };
    return new FormGroup<AuthorityFormGroupContent>({
      id: new FormControl(
        { value: authorityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(authorityRawValue.name),
      users: new FormControl(authorityRawValue.users ?? []),
    });
  }

  getAuthority(form: AuthorityFormGroup): IAuthority | NewAuthority {
    return form.getRawValue() as IAuthority | NewAuthority;
  }

  resetForm(form: AuthorityFormGroup, authority: AuthorityFormGroupInput): void {
    const authorityRawValue = { ...this.getFormDefaults(), ...authority };
    form.reset(
      {
        ...authorityRawValue,
        id: { value: authorityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AuthorityFormDefaults {
    return {
      id: null,
      users: [],
    };
  }
}
