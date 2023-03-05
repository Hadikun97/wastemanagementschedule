import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOnDuty } from '../on-duty.model';
import { OnDutyService } from '../service/on-duty.service';

@Injectable({ providedIn: 'root' })
export class OnDutyRoutingResolveService implements Resolve<IOnDuty | null> {
  constructor(protected service: OnDutyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOnDuty | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((onDuty: HttpResponse<IOnDuty>) => {
          if (onDuty.body) {
            return of(onDuty.body);
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
