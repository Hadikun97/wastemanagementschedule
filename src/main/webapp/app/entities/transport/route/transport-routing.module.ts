import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TransportComponent } from '../list/transport.component';
import { TransportDetailComponent } from '../detail/transport-detail.component';
import { TransportUpdateComponent } from '../update/transport-update.component';
import { TransportRoutingResolveService } from './transport-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const transportRoute: Routes = [
  {
    path: '',
    component: TransportComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TransportDetailComponent,
    resolve: {
      transport: TransportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TransportUpdateComponent,
    resolve: {
      transport: TransportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TransportUpdateComponent,
    resolve: {
      transport: TransportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(transportRoute)],
  exports: [RouterModule],
})
export class TransportRoutingModule {}
