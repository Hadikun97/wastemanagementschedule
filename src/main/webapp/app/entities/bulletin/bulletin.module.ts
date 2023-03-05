import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BulletinComponent } from './list/bulletin.component';
import { BulletinDetailComponent } from './detail/bulletin-detail.component';
import { BulletinUpdateComponent } from './update/bulletin-update.component';
import { BulletinDeleteDialogComponent } from './delete/bulletin-delete-dialog.component';
import { BulletinRoutingModule } from './route/bulletin-routing.module';

@NgModule({
  imports: [SharedModule, BulletinRoutingModule],
  declarations: [BulletinComponent, BulletinDetailComponent, BulletinUpdateComponent, BulletinDeleteDialogComponent],
})
export class BulletinModule {}
