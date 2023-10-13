import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPersons } from '../persons.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../persons.test-samples';

import { PersonsService } from './persons.service';

const requireRestSample: IPersons = {
  ...sampleWithRequiredData,
};

describe('Persons Service', () => {
  let service: PersonsService;
  let httpMock: HttpTestingController;
  let expectedResult: IPersons | IPersons[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PersonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Persons', () => {
      const persons = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(persons).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Persons', () => {
      const persons = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(persons).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Persons', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Persons', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Persons', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPersonsToCollectionIfMissing', () => {
      it('should add a Persons to an empty array', () => {
        const persons: IPersons = sampleWithRequiredData;
        expectedResult = service.addPersonsToCollectionIfMissing([], persons);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(persons);
      });

      it('should not add a Persons to an array that contains it', () => {
        const persons: IPersons = sampleWithRequiredData;
        const personsCollection: IPersons[] = [
          {
            ...persons,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPersonsToCollectionIfMissing(personsCollection, persons);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Persons to an array that doesn't contain it", () => {
        const persons: IPersons = sampleWithRequiredData;
        const personsCollection: IPersons[] = [sampleWithPartialData];
        expectedResult = service.addPersonsToCollectionIfMissing(personsCollection, persons);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(persons);
      });

      it('should add only unique Persons to an array', () => {
        const personsArray: IPersons[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const personsCollection: IPersons[] = [sampleWithRequiredData];
        expectedResult = service.addPersonsToCollectionIfMissing(personsCollection, ...personsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const persons: IPersons = sampleWithRequiredData;
        const persons2: IPersons = sampleWithPartialData;
        expectedResult = service.addPersonsToCollectionIfMissing([], persons, persons2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(persons);
        expect(expectedResult).toContain(persons2);
      });

      it('should accept null and undefined values', () => {
        const persons: IPersons = sampleWithRequiredData;
        expectedResult = service.addPersonsToCollectionIfMissing([], null, persons, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(persons);
      });

      it('should return initial array if no Persons is added', () => {
        const personsCollection: IPersons[] = [sampleWithRequiredData];
        expectedResult = service.addPersonsToCollectionIfMissing(personsCollection, undefined, null);
        expect(expectedResult).toEqual(personsCollection);
      });
    });

    describe('comparePersons', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePersons(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePersons(entity1, entity2);
        const compareResult2 = service.comparePersons(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePersons(entity1, entity2);
        const compareResult2 = service.comparePersons(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePersons(entity1, entity2);
        const compareResult2 = service.comparePersons(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
