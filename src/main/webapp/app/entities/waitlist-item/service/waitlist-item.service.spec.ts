import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWaitlistItem } from '../waitlist-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../waitlist-item.test-samples';

import { WaitlistItemService, RestWaitlistItem } from './waitlist-item.service';

const requireRestSample: RestWaitlistItem = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('WaitlistItem Service', () => {
  let service: WaitlistItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IWaitlistItem | IWaitlistItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WaitlistItemService);
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

    it('should create a WaitlistItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const waitlistItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(waitlistItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a WaitlistItem', () => {
      const waitlistItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(waitlistItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a WaitlistItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of WaitlistItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a WaitlistItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWaitlistItemToCollectionIfMissing', () => {
      it('should add a WaitlistItem to an empty array', () => {
        const waitlistItem: IWaitlistItem = sampleWithRequiredData;
        expectedResult = service.addWaitlistItemToCollectionIfMissing([], waitlistItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(waitlistItem);
      });

      it('should not add a WaitlistItem to an array that contains it', () => {
        const waitlistItem: IWaitlistItem = sampleWithRequiredData;
        const waitlistItemCollection: IWaitlistItem[] = [
          {
            ...waitlistItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWaitlistItemToCollectionIfMissing(waitlistItemCollection, waitlistItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WaitlistItem to an array that doesn't contain it", () => {
        const waitlistItem: IWaitlistItem = sampleWithRequiredData;
        const waitlistItemCollection: IWaitlistItem[] = [sampleWithPartialData];
        expectedResult = service.addWaitlistItemToCollectionIfMissing(waitlistItemCollection, waitlistItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(waitlistItem);
      });

      it('should add only unique WaitlistItem to an array', () => {
        const waitlistItemArray: IWaitlistItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const waitlistItemCollection: IWaitlistItem[] = [sampleWithRequiredData];
        expectedResult = service.addWaitlistItemToCollectionIfMissing(waitlistItemCollection, ...waitlistItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const waitlistItem: IWaitlistItem = sampleWithRequiredData;
        const waitlistItem2: IWaitlistItem = sampleWithPartialData;
        expectedResult = service.addWaitlistItemToCollectionIfMissing([], waitlistItem, waitlistItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(waitlistItem);
        expect(expectedResult).toContain(waitlistItem2);
      });

      it('should accept null and undefined values', () => {
        const waitlistItem: IWaitlistItem = sampleWithRequiredData;
        expectedResult = service.addWaitlistItemToCollectionIfMissing([], null, waitlistItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(waitlistItem);
      });

      it('should return initial array if no WaitlistItem is added', () => {
        const waitlistItemCollection: IWaitlistItem[] = [sampleWithRequiredData];
        expectedResult = service.addWaitlistItemToCollectionIfMissing(waitlistItemCollection, undefined, null);
        expect(expectedResult).toEqual(waitlistItemCollection);
      });
    });

    describe('compareWaitlistItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWaitlistItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWaitlistItem(entity1, entity2);
        const compareResult2 = service.compareWaitlistItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWaitlistItem(entity1, entity2);
        const compareResult2 = service.compareWaitlistItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWaitlistItem(entity1, entity2);
        const compareResult2 = service.compareWaitlistItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
