import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../persons.test-samples';

import { PersonsFormService } from './persons-form.service';

describe('Persons Form Service', () => {
  let service: PersonsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonsFormService);
  });

  describe('Service methods', () => {
    describe('createPersonsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPersonsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            mobilePhone: expect.any(Object),
            userId: expect.any(Object),
          }),
        );
      });

      it('passing IPersons should create a new form with FormGroup', () => {
        const formGroup = service.createPersonsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            mobilePhone: expect.any(Object),
            userId: expect.any(Object),
          }),
        );
      });
    });

    describe('getPersons', () => {
      it('should return NewPersons for default Persons initial value', () => {
        const formGroup = service.createPersonsFormGroup(sampleWithNewData);

        const persons = service.getPersons(formGroup) as any;

        expect(persons).toMatchObject(sampleWithNewData);
      });

      it('should return NewPersons for empty Persons initial value', () => {
        const formGroup = service.createPersonsFormGroup();

        const persons = service.getPersons(formGroup) as any;

        expect(persons).toMatchObject({});
      });

      it('should return IPersons', () => {
        const formGroup = service.createPersonsFormGroup(sampleWithRequiredData);

        const persons = service.getPersons(formGroup) as any;

        expect(persons).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPersons should not enable id FormControl', () => {
        const formGroup = service.createPersonsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPersons should disable id FormControl', () => {
        const formGroup = service.createPersonsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
