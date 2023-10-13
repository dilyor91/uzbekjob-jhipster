import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompanyMembers } from '../company-members.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../company-members.test-samples';

import { CompanyMembersService } from './company-members.service';

const requireRestSample: ICompanyMembers = {
  ...sampleWithRequiredData,
};

describe('CompanyMembers Service', () => {
  let service: CompanyMembersService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompanyMembers | ICompanyMembers[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompanyMembersService);
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

    it('should create a CompanyMembers', () => {
      const companyMembers = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(companyMembers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompanyMembers', () => {
      const companyMembers = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(companyMembers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompanyMembers', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompanyMembers', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompanyMembers', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompanyMembersToCollectionIfMissing', () => {
      it('should add a CompanyMembers to an empty array', () => {
        const companyMembers: ICompanyMembers = sampleWithRequiredData;
        expectedResult = service.addCompanyMembersToCollectionIfMissing([], companyMembers);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyMembers);
      });

      it('should not add a CompanyMembers to an array that contains it', () => {
        const companyMembers: ICompanyMembers = sampleWithRequiredData;
        const companyMembersCollection: ICompanyMembers[] = [
          {
            ...companyMembers,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompanyMembersToCollectionIfMissing(companyMembersCollection, companyMembers);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompanyMembers to an array that doesn't contain it", () => {
        const companyMembers: ICompanyMembers = sampleWithRequiredData;
        const companyMembersCollection: ICompanyMembers[] = [sampleWithPartialData];
        expectedResult = service.addCompanyMembersToCollectionIfMissing(companyMembersCollection, companyMembers);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyMembers);
      });

      it('should add only unique CompanyMembers to an array', () => {
        const companyMembersArray: ICompanyMembers[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const companyMembersCollection: ICompanyMembers[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyMembersToCollectionIfMissing(companyMembersCollection, ...companyMembersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const companyMembers: ICompanyMembers = sampleWithRequiredData;
        const companyMembers2: ICompanyMembers = sampleWithPartialData;
        expectedResult = service.addCompanyMembersToCollectionIfMissing([], companyMembers, companyMembers2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyMembers);
        expect(expectedResult).toContain(companyMembers2);
      });

      it('should accept null and undefined values', () => {
        const companyMembers: ICompanyMembers = sampleWithRequiredData;
        expectedResult = service.addCompanyMembersToCollectionIfMissing([], null, companyMembers, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyMembers);
      });

      it('should return initial array if no CompanyMembers is added', () => {
        const companyMembersCollection: ICompanyMembers[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyMembersToCollectionIfMissing(companyMembersCollection, undefined, null);
        expect(expectedResult).toEqual(companyMembersCollection);
      });
    });

    describe('compareCompanyMembers', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompanyMembers(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompanyMembers(entity1, entity2);
        const compareResult2 = service.compareCompanyMembers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompanyMembers(entity1, entity2);
        const compareResult2 = service.compareCompanyMembers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompanyMembers(entity1, entity2);
        const compareResult2 = service.compareCompanyMembers(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
