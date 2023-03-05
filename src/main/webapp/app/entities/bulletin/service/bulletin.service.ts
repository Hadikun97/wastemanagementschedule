import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBulletin, NewBulletin } from '../bulletin.model';

export type PartialUpdateBulletin = Partial<IBulletin> & Pick<IBulletin, 'id'>;

export type EntityResponseType = HttpResponse<IBulletin>;
export type EntityArrayResponseType = HttpResponse<IBulletin[]>;

@Injectable({ providedIn: 'root' })
export class BulletinService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bulletins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bulletin: NewBulletin): Observable<EntityResponseType> {
    return this.http.post<IBulletin>(this.resourceUrl, bulletin, { observe: 'response' });
  }

  update(bulletin: IBulletin): Observable<EntityResponseType> {
    return this.http.put<IBulletin>(`${this.resourceUrl}/${this.getBulletinIdentifier(bulletin)}`, bulletin, { observe: 'response' });
  }

  partialUpdate(bulletin: PartialUpdateBulletin): Observable<EntityResponseType> {
    return this.http.patch<IBulletin>(`${this.resourceUrl}/${this.getBulletinIdentifier(bulletin)}`, bulletin, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBulletin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBulletin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBulletinIdentifier(bulletin: Pick<IBulletin, 'id'>): number {
    return bulletin.id;
  }

  compareBulletin(o1: Pick<IBulletin, 'id'> | null, o2: Pick<IBulletin, 'id'> | null): boolean {
    return o1 && o2 ? this.getBulletinIdentifier(o1) === this.getBulletinIdentifier(o2) : o1 === o2;
  }

  addBulletinToCollectionIfMissing<Type extends Pick<IBulletin, 'id'>>(
    bulletinCollection: Type[],
    ...bulletinsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bulletins: Type[] = bulletinsToCheck.filter(isPresent);
    if (bulletins.length > 0) {
      const bulletinCollectionIdentifiers = bulletinCollection.map(bulletinItem => this.getBulletinIdentifier(bulletinItem)!);
      const bulletinsToAdd = bulletins.filter(bulletinItem => {
        const bulletinIdentifier = this.getBulletinIdentifier(bulletinItem);
        if (bulletinCollectionIdentifiers.includes(bulletinIdentifier)) {
          return false;
        }
        bulletinCollectionIdentifiers.push(bulletinIdentifier);
        return true;
      });
      return [...bulletinsToAdd, ...bulletinCollection];
    }
    return bulletinCollection;
  }
}
