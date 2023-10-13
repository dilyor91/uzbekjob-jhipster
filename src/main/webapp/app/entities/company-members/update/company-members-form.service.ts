import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompanyMembers, NewCompanyMembers } from '../company-members.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompanyMembers for edit and NewCompanyMembersFormGroupInput for create.
 */
type CompanyMembersFormGroupInput = ICompanyMembers | PartialWithRequiredKeyOf<NewCompanyMembers>;

type CompanyMembersFormDefaults = Pick<NewCompanyMembers, 'id'>;

type CompanyMembersFormGroupContent = {
  id: FormControl<ICompanyMembers['id'] | NewCompanyMembers['id']>;
  companyName: FormControl<ICompanyMembers['companyName']>;
  businessRegNum: FormControl<ICompanyMembers['businessRegNum']>;
  represantitiveName: FormControl<ICompanyMembers['represantitiveName']>;
  companyAddress: FormControl<ICompanyMembers['companyAddress']>;
  subscriberName: FormControl<ICompanyMembers['subscriberName']>;
  phoneNumber: FormControl<ICompanyMembers['phoneNumber']>;
  membersType: FormControl<ICompanyMembers['membersType']>;
  userId: FormControl<ICompanyMembers['userId']>;
};

export type CompanyMembersFormGroup = FormGroup<CompanyMembersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompanyMembersFormService {
  createCompanyMembersFormGroup(companyMembers: CompanyMembersFormGroupInput = { id: null }): CompanyMembersFormGroup {
    const companyMembersRawValue = {
      ...this.getFormDefaults(),
      ...companyMembers,
    };
    return new FormGroup<CompanyMembersFormGroupContent>({
      id: new FormControl(
        { value: companyMembersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      companyName: new FormControl(companyMembersRawValue.companyName),
      businessRegNum: new FormControl(companyMembersRawValue.businessRegNum),
      represantitiveName: new FormControl(companyMembersRawValue.represantitiveName),
      companyAddress: new FormControl(companyMembersRawValue.companyAddress),
      subscriberName: new FormControl(companyMembersRawValue.subscriberName),
      phoneNumber: new FormControl(companyMembersRawValue.phoneNumber),
      membersType: new FormControl(companyMembersRawValue.membersType),
      userId: new FormControl(companyMembersRawValue.userId),
    });
  }

  getCompanyMembers(form: CompanyMembersFormGroup): ICompanyMembers | NewCompanyMembers {
    return form.getRawValue() as ICompanyMembers | NewCompanyMembers;
  }

  resetForm(form: CompanyMembersFormGroup, companyMembers: CompanyMembersFormGroupInput): void {
    const companyMembersRawValue = { ...this.getFormDefaults(), ...companyMembers };
    form.reset(
      {
        ...companyMembersRawValue,
        id: { value: companyMembersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CompanyMembersFormDefaults {
    return {
      id: null,
    };
  }
}
