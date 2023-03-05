import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BulletinComponent } from '../list/bulletin.component';
import { BulletinDetailComponent } from '../detail/bulletin-detail.component';
import { BulletinUpdateComponent } from '../update/bulletin-update.component';
import { BulletinRoutingResolveService } from './bulletin-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bulletinRoute: Routes = [
  {
    path: '',
    component: BulletinComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BulletinDetailComponent,
    resolve: {
      bulletin: BulletinRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BulletinUpdateComponent,
    resolve: {
      bulletin: BulletinRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BulletinUpdateComponent,
    resolve: {
      bulletin: BulletinRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bulletinRoute)],
  exports: [RouterModule],
})
export class BulletinRoutingModule {}
