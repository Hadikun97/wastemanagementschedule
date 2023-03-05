import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OnDutyComponent } from './list/on-duty.component';
import { OnDutyDetailComponent } from './detail/on-duty-detail.component';
import { OnDutyUpdateComponent } from './update/on-duty-update.component';
import { OnDutyDeleteDialogComponent } from './delete/on-duty-delete-dialog.component';
import { OnDutyRoutingModule } from './route/on-duty-routing.module';

@NgModule({
  imports: [SharedModule, OnDutyRoutingModule],
  declarations: [OnDutyComponent, OnDutyDetailComponent, OnDutyUpdateComponent, OnDutyDeleteDialogComponent],
})
export class OnDutyModule {}
