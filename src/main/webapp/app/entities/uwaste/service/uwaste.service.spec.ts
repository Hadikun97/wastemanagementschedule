import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUwaste } from '../uwaste.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../uwaste.test-samples';

import { UwasteService } from './uwaste.service';

const requireRestSample: IUwaste = {
  ...sampleWithRequiredData,
};

describe('Uwaste Service', () => {
  let service: UwasteService;
  let httpMock: HttpTestingController;
  let expectedResult: IUwaste | IUwaste[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UwasteService);
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

    it('should create a Uwaste', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const uwaste = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(uwaste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Uwaste', () => {
      const uwaste = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(uwaste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Uwaste', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Uwaste', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Uwaste', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUwasteToCollectionIfMissing', () => {
      it('should add a Uwaste to an empty array', () => {
        const uwaste: IUwaste = sampleWithRequiredData;
        expectedResult = service.addUwasteToCollectionIfMissing([], uwaste);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(uwaste);
      });

      it('should not add a Uwaste to an array that contains it', () => {
        const uwaste: IUwaste = sampleWithRequiredData;
        const uwasteCollection: IUwaste[] = [
          {
            ...uwaste,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUwasteToCollectionIfMissing(uwasteCollection, uwaste);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Uwaste to an array that doesn't contain it", () => {
        const uwaste: IUwaste = sampleWithRequiredData;
        const uwasteCollection: IUwaste[] = [sampleWithPartialData];
        expectedResult = service.addUwasteToCollectionIfMissing(uwasteCollection, uwaste);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(uwaste);
      });

      it('should add only unique Uwaste to an array', () => {
        const uwasteArray: IUwaste[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const uwasteCollection: IUwaste[] = [sampleWithRequiredData];
        expectedResult = service.addUwasteToCollectionIfMissing(uwasteCollection, ...uwasteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const uwaste: IUwaste = sampleWithRequiredData;
        const uwaste2: IUwaste = sampleWithPartialData;
        expectedResult = service.addUwasteToCollectionIfMissing([], uwaste, uwaste2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(uwaste);
        expect(expectedResult).toContain(uwaste2);
      });

      it('should accept null and undefined values', () => {
        const uwaste: IUwaste = sampleWithRequiredData;
        expectedResult = service.addUwasteToCollectionIfMissing([], null, uwaste, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(uwaste);
      });

      it('should return initial array if no Uwaste is added', () => {
        const uwasteCollection: IUwaste[] = [sampleWithRequiredData];
        expectedResult = service.addUwasteToCollectionIfMissing(uwasteCollection, undefined, null);
        expect(expectedResult).toEqual(uwasteCollection);
      });
    });

    describe('compareUwaste', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUwaste(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUwaste(entity1, entity2);
        const compareResult2 = service.compareUwaste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUwaste(entity1, entity2);
        const compareResult2 = service.compareUwaste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUwaste(entity1, entity2);
        const compareResult2 = service.compareUwaste(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
