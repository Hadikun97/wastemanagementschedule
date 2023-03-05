import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBulletin } from '../bulletin.model';
import { BulletinService } from '../service/bulletin.service';

@Injectable({ providedIn: 'root' })
export class BulletinRoutingResolveService implements Resolve<IBulletin | null> {
  constructor(protected service: BulletinService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBulletin | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bulletin: HttpResponse<IBulletin>) => {
          if (bulletin.body) {
            return of(bulletin.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
