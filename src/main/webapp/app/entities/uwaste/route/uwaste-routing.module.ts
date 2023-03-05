import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UwasteComponent } from '../list/uwaste.component';
import { UwasteDetailComponent } from '../detail/uwaste-detail.component';
import { UwasteUpdateComponent } from '../update/uwaste-update.component';
import { UwasteRoutingResolveService } from './uwaste-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const uwasteRoute: Routes = [
  {
    path: '',
    component: UwasteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UwasteDetailComponent,
    resolve: {
      uwaste: UwasteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UwasteUpdateComponent,
    resolve: {
      uwaste: UwasteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UwasteUpdateComponent,
    resolve: {
      uwaste: UwasteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(uwasteRoute)],
  exports: [RouterModule],
})
export class UwasteRoutingModule {}
