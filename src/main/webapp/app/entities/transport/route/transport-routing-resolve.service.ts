import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransport } from '../transport.model';
import { TransportService } from '../service/transport.service';

@Injectable({ providedIn: 'root' })
export class TransportRoutingResolveService implements Resolve<ITransport | null> {
  constructor(protected service: TransportService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransport | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transport: HttpResponse<ITransport>) => {
          if (transport.body) {
            return of(transport.body);
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
