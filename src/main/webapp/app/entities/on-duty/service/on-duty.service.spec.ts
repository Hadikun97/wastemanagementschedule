import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOnDuty } from '../on-duty.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../on-duty.test-samples';

import { OnDutyService } from './on-duty.service';

const requireRestSample: IOnDuty = {
  ...sampleWithRequiredData,
};

describe('OnDuty Service', () => {
  let service: OnDutyService;
  let httpMock: HttpTestingController;
  let expectedResult: IOnDuty | IOnDuty[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OnDutyService);
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

    it('should create a OnDuty', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const onDuty = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(onDuty).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OnDuty', () => {
      const onDuty = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(onDuty).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OnDuty', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OnDuty', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OnDuty', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOnDutyToCollectionIfMissing', () => {
      it('should add a OnDuty to an empty array', () => {
        const onDuty: IOnDuty = sampleWithRequiredData;
        expectedResult = service.addOnDutyToCollectionIfMissing([], onDuty);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(onDuty);
      });

      it('should not add a OnDuty to an array that contains it', () => {
        const onDuty: IOnDuty = sampleWithRequiredData;
        const onDutyCollection: IOnDuty[] = [
          {
            ...onDuty,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOnDutyToCollectionIfMissing(onDutyCollection, onDuty);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OnDuty to an array that doesn't contain it", () => {
        const onDuty: IOnDuty = sampleWithRequiredData;
        const onDutyCollection: IOnDuty[] = [sampleWithPartialData];
        expectedResult = service.addOnDutyToCollectionIfMissing(onDutyCollection, onDuty);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(onDuty);
      });

      it('should add only unique OnDuty to an array', () => {
        const onDutyArray: IOnDuty[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const onDutyCollection: IOnDuty[] = [sampleWithRequiredData];
        expectedResult = service.addOnDutyToCollectionIfMissing(onDutyCollection, ...onDutyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const onDuty: IOnDuty = sampleWithRequiredData;
        const onDuty2: IOnDuty = sampleWithPartialData;
        expectedResult = service.addOnDutyToCollectionIfMissing([], onDuty, onDuty2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(onDuty);
        expect(expectedResult).toContain(onDuty2);
      });

      it('should accept null and undefined values', () => {
        const onDuty: IOnDuty = sampleWithRequiredData;
        expectedResult = service.addOnDutyToCollectionIfMissing([], null, onDuty, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(onDuty);
      });

      it('should return initial array if no OnDuty is added', () => {
        const onDutyCollection: IOnDuty[] = [sampleWithRequiredData];
        expectedResult = service.addOnDutyToCollectionIfMissing(onDutyCollection, undefined, null);
        expect(expectedResult).toEqual(onDutyCollection);
      });
    });

    describe('compareOnDuty', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOnDuty(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOnDuty(entity1, entity2);
        const compareResult2 = service.compareOnDuty(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOnDuty(entity1, entity2);
        const compareResult2 = service.compareOnDuty(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOnDuty(entity1, entity2);
        const compareResult2 = service.compareOnDuty(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
