import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../company-members.test-samples';

import { CompanyMembersFormService } from './company-members-form.service';

describe('CompanyMembers Form Service', () => {
  let service: CompanyMembersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyMembersFormService);
  });

  describe('Service methods', () => {
    describe('createCompanyMembersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompanyMembersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            companyName: expect.any(Object),
            businessRegNum: expect.any(Object),
            represantitiveName: expect.any(Object),
            companyAddress: expect.any(Object),
            subscriberName: expect.any(Object),
            phoneNumber: expect.any(Object),
            membersType: expect.any(Object),
            userId: expect.any(Object),
          }),
        );
      });

      it('passing ICompanyMembers should create a new form with FormGroup', () => {
        const formGroup = service.createCompanyMembersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            companyName: expect.any(Object),
            businessRegNum: expect.any(Object),
            represantitiveName: expect.any(Object),
            companyAddress: expect.any(Object),
            subscriberName: expect.any(Object),
            phoneNumber: expect.any(Object),
            membersType: expect.any(Object),
            userId: expect.any(Object),
          }),
        );
      });
    });

    describe('getCompanyMembers', () => {
      it('should return NewCompanyMembers for default CompanyMembers initial value', () => {
        const formGroup = service.createCompanyMembersFormGroup(sampleWithNewData);

        const companyMembers = service.getCompanyMembers(formGroup) as any;

        expect(companyMembers).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompanyMembers for empty CompanyMembers initial value', () => {
        const formGroup = service.createCompanyMembersFormGroup();

        const companyMembers = service.getCompanyMembers(formGroup) as any;

        expect(companyMembers).toMatchObject({});
      });

      it('should return ICompanyMembers', () => {
        const formGroup = service.createCompanyMembersFormGroup(sampleWithRequiredData);

        const companyMembers = service.getCompanyMembers(formGroup) as any;

        expect(companyMembers).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompanyMembers should not enable id FormControl', () => {
        const formGroup = service.createCompanyMembersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompanyMembers should disable id FormControl', () => {
        const formGroup = service.createCompanyMembersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
