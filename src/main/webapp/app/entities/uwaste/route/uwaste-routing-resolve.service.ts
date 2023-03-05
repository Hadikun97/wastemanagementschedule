import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUwaste } from '../uwaste.model';
import { UwasteService } from '../service/uwaste.service';

@Injectable({ providedIn: 'root' })
export class UwasteRoutingResolveService implements Resolve<IUwaste | null> {
  constructor(protected service: UwasteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUwaste | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((uwaste: HttpResponse<IUwaste>) => {
          if (uwaste.body) {
            return of(uwaste.body);
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
