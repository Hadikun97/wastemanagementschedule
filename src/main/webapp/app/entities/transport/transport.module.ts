import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TransportComponent } from './list/transport.component';
import { TransportDetailComponent } from './detail/transport-detail.component';
import { TransportUpdateComponent } from './update/transport-update.component';
import { TransportDeleteDialogComponent } from './delete/transport-delete-dialog.component';
import { TransportRoutingModule } from './route/transport-routing.module';

@NgModule({
  imports: [SharedModule, TransportRoutingModule],
  declarations: [TransportComponent, TransportDetailComponent, TransportUpdateComponent, TransportDeleteDialogComponent],
})
export class TransportModule {}
