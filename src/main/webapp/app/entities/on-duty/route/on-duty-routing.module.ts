import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OnDutyComponent } from '../list/on-duty.component';
import { OnDutyDetailComponent } from '../detail/on-duty-detail.component';
import { OnDutyUpdateComponent } from '../update/on-duty-update.component';
import { OnDutyRoutingResolveService } from './on-duty-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const onDutyRoute: Routes = [
  {
    path: '',
    component: OnDutyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OnDutyDetailComponent,
    resolve: {
      onDuty: OnDutyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OnDutyUpdateComponent,
    resolve: {
      onDuty: OnDutyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OnDutyUpdateComponent,
    resolve: {
      onDuty: OnDutyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(onDutyRoute)],
  exports: [RouterModule],
})
export class OnDutyRoutingModule {}
