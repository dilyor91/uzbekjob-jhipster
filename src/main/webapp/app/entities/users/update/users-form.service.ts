import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUsers, NewUsers } from '../users.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUsers for edit and NewUsersFormGroupInput for create.
 */
type UsersFormGroupInput = IUsers | PartialWithRequiredKeyOf<NewUsers>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUsers | NewUsers> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

type UsersFormRawValue = FormValueOf<IUsers>;

type NewUsersFormRawValue = FormValueOf<NewUsers>;

type UsersFormDefaults = Pick<NewUsers, 'id' | 'createdAt' | 'updatedAt' | 'authorities'>;

type UsersFormGroupContent = {
  id: FormControl<UsersFormRawValue['id'] | NewUsers['id']>;
  userName: FormControl<UsersFormRawValue['userName']>;
  email: FormControl<UsersFormRawValue['email']>;
  password: FormControl<UsersFormRawValue['password']>;
  status: FormControl<UsersFormRawValue['status']>;
  createdAt: FormControl<UsersFormRawValue['createdAt']>;
  updatedAt: FormControl<UsersFormRawValue['updatedAt']>;
  createdBy: FormControl<UsersFormRawValue['createdBy']>;
  updatedBy: FormControl<UsersFormRawValue['updatedBy']>;
  authorities: FormControl<UsersFormRawValue['authorities']>;
};

export type UsersFormGroup = FormGroup<UsersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UsersFormService {
  createUsersFormGroup(users: UsersFormGroupInput = { id: null }): UsersFormGroup {
    const usersRawValue = this.convertUsersToUsersRawValue({
      ...this.getFormDefaults(),
      ...users,
    });
    return new FormGroup<UsersFormGroupContent>({
      id: new FormControl(
        { value: usersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      userName: new FormControl(usersRawValue.userName),
      email: new FormControl(usersRawValue.email),
      password: new FormControl(usersRawValue.password),
      status: new FormControl(usersRawValue.status),
      createdAt: new FormControl(usersRawValue.createdAt),
      updatedAt: new FormControl(usersRawValue.updatedAt),
      createdBy: new FormControl(usersRawValue.createdBy),
      updatedBy: new FormControl(usersRawValue.updatedBy),
      authorities: new FormControl(usersRawValue.authorities ?? []),
    });
  }

  getUsers(form: UsersFormGroup): IUsers | NewUsers {
    return this.convertUsersRawValueToUsers(form.getRawValue() as UsersFormRawValue | NewUsersFormRawValue);
  }

  resetForm(form: UsersFormGroup, users: UsersFormGroupInput): void {
    const usersRawValue = this.convertUsersToUsersRawValue({ ...this.getFormDefaults(), ...users });
    form.reset(
      {
        ...usersRawValue,
        id: { value: usersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UsersFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      authorities: [],
    };
  }

  private convertUsersRawValueToUsers(rawUsers: UsersFormRawValue | NewUsersFormRawValue): IUsers | NewUsers {
    return {
      ...rawUsers,
      createdAt: dayjs(rawUsers.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawUsers.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertUsersToUsersRawValue(
    users: IUsers | (Partial<NewUsers> & UsersFormDefaults),
  ): UsersFormRawValue | PartialWithRequiredKeyOf<NewUsersFormRawValue> {
    return {
      ...users,
      createdAt: users.createdAt ? users.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: users.updatedAt ? users.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      authorities: users.authorities ?? [],
    };
  }
}
