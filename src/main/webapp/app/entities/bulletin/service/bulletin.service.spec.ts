import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBulletin } from '../bulletin.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../bulletin.test-samples';

import { BulletinService } from './bulletin.service';

const requireRestSample: IBulletin = {
  ...sampleWithRequiredData,
};

describe('Bulletin Service', () => {
  let service: BulletinService;
  let httpMock: HttpTestingController;
  let expectedResult: IBulletin | IBulletin[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BulletinService);
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

    it('should create a Bulletin', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bulletin = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bulletin).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bulletin', () => {
      const bulletin = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bulletin).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bulletin', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bulletin', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Bulletin', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBulletinToCollectionIfMissing', () => {
      it('should add a Bulletin to an empty array', () => {
        const bulletin: IBulletin = sampleWithRequiredData;
        expectedResult = service.addBulletinToCollectionIfMissing([], bulletin);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bulletin);
      });

      it('should not add a Bulletin to an array that contains it', () => {
        const bulletin: IBulletin = sampleWithRequiredData;
        const bulletinCollection: IBulletin[] = [
          {
            ...bulletin,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBulletinToCollectionIfMissing(bulletinCollection, bulletin);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bulletin to an array that doesn't contain it", () => {
        const bulletin: IBulletin = sampleWithRequiredData;
        const bulletinCollection: IBulletin[] = [sampleWithPartialData];
        expectedResult = service.addBulletinToCollectionIfMissing(bulletinCollection, bulletin);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bulletin);
      });

      it('should add only unique Bulletin to an array', () => {
        const bulletinArray: IBulletin[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bulletinCollection: IBulletin[] = [sampleWithRequiredData];
        expectedResult = service.addBulletinToCollectionIfMissing(bulletinCollection, ...bulletinArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bulletin: IBulletin = sampleWithRequiredData;
        const bulletin2: IBulletin = sampleWithPartialData;
        expectedResult = service.addBulletinToCollectionIfMissing([], bulletin, bulletin2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bulletin);
        expect(expectedResult).toContain(bulletin2);
      });

      it('should accept null and undefined values', () => {
        const bulletin: IBulletin = sampleWithRequiredData;
        expectedResult = service.addBulletinToCollectionIfMissing([], null, bulletin, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bulletin);
      });

      it('should return initial array if no Bulletin is added', () => {
        const bulletinCollection: IBulletin[] = [sampleWithRequiredData];
        expectedResult = service.addBulletinToCollectionIfMissing(bulletinCollection, undefined, null);
        expect(expectedResult).toEqual(bulletinCollection);
      });
    });

    describe('compareBulletin', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBulletin(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBulletin(entity1, entity2);
        const compareResult2 = service.compareBulletin(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBulletin(entity1, entity2);
        const compareResult2 = service.compareBulletin(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBulletin(entity1, entity2);
        const compareResult2 = service.compareBulletin(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
