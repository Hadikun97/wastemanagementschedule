import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransport } from '../transport.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../transport.test-samples';

import { TransportService } from './transport.service';

const requireRestSample: ITransport = {
  ...sampleWithRequiredData,
};

describe('Transport Service', () => {
  let service: TransportService;
  let httpMock: HttpTestingController;
  let expectedResult: ITransport | ITransport[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TransportService);
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

    it('should create a Transport', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const transport = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(transport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Transport', () => {
      const transport = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(transport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Transport', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Transport', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Transport', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTransportToCollectionIfMissing', () => {
      it('should add a Transport to an empty array', () => {
        const transport: ITransport = sampleWithRequiredData;
        expectedResult = service.addTransportToCollectionIfMissing([], transport);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transport);
      });

      it('should not add a Transport to an array that contains it', () => {
        const transport: ITransport = sampleWithRequiredData;
        const transportCollection: ITransport[] = [
          {
            ...transport,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTransportToCollectionIfMissing(transportCollection, transport);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Transport to an array that doesn't contain it", () => {
        const transport: ITransport = sampleWithRequiredData;
        const transportCollection: ITransport[] = [sampleWithPartialData];
        expectedResult = service.addTransportToCollectionIfMissing(transportCollection, transport);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transport);
      });

      it('should add only unique Transport to an array', () => {
        const transportArray: ITransport[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const transportCollection: ITransport[] = [sampleWithRequiredData];
        expectedResult = service.addTransportToCollectionIfMissing(transportCollection, ...transportArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const transport: ITransport = sampleWithRequiredData;
        const transport2: ITransport = sampleWithPartialData;
        expectedResult = service.addTransportToCollectionIfMissing([], transport, transport2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transport);
        expect(expectedResult).toContain(transport2);
      });

      it('should accept null and undefined values', () => {
        const transport: ITransport = sampleWithRequiredData;
        expectedResult = service.addTransportToCollectionIfMissing([], null, transport, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transport);
      });

      it('should return initial array if no Transport is added', () => {
        const transportCollection: ITransport[] = [sampleWithRequiredData];
        expectedResult = service.addTransportToCollectionIfMissing(transportCollection, undefined, null);
        expect(expectedResult).toEqual(transportCollection);
      });
    });

    describe('compareTransport', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTransport(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTransport(entity1, entity2);
        const compareResult2 = service.compareTransport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTransport(entity1, entity2);
        const compareResult2 = service.compareTransport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTransport(entity1, entity2);
        const compareResult2 = service.compareTransport(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
