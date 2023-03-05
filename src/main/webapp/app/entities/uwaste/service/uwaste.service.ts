import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUwaste, NewUwaste } from '../uwaste.model';

export type PartialUpdateUwaste = Partial<IUwaste> & Pick<IUwaste, 'id'>;

export type EntityResponseType = HttpResponse<IUwaste>;
export type EntityArrayResponseType = HttpResponse<IUwaste[]>;

@Injectable({ providedIn: 'root' })
export class UwasteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/uwastes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(uwaste: NewUwaste): Observable<EntityResponseType> {
    return this.http.post<IUwaste>(this.resourceUrl, uwaste, { observe: 'response' });
  }

  update(uwaste: IUwaste): Observable<EntityResponseType> {
    return this.http.put<IUwaste>(`${this.resourceUrl}/${this.getUwasteIdentifier(uwaste)}`, uwaste, { observe: 'response' });
  }

  partialUpdate(uwaste: PartialUpdateUwaste): Observable<EntityResponseType> {
    return this.http.patch<IUwaste>(`${this.resourceUrl}/${this.getUwasteIdentifier(uwaste)}`, uwaste, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUwaste>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUwaste[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUwasteIdentifier(uwaste: Pick<IUwaste, 'id'>): number {
    return uwaste.id;
  }

  compareUwaste(o1: Pick<IUwaste, 'id'> | null, o2: Pick<IUwaste, 'id'> | null): boolean {
    return o1 && o2 ? this.getUwasteIdentifier(o1) === this.getUwasteIdentifier(o2) : o1 === o2;
  }

  addUwasteToCollectionIfMissing<Type extends Pick<IUwaste, 'id'>>(
    uwasteCollection: Type[],
    ...uwastesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const uwastes: Type[] = uwastesToCheck.filter(isPresent);
    if (uwastes.length > 0) {
      const uwasteCollectionIdentifiers = uwasteCollection.map(uwasteItem => this.getUwasteIdentifier(uwasteItem)!);
      const uwastesToAdd = uwastes.filter(uwasteItem => {
        const uwasteIdentifier = this.getUwasteIdentifier(uwasteItem);
        if (uwasteCollectionIdentifiers.includes(uwasteIdentifier)) {
          return false;
        }
        uwasteCollectionIdentifiers.push(uwasteIdentifier);
        return true;
      });
      return [...uwastesToAdd, ...uwasteCollection];
    }
    return uwasteCollection;
  }
}
