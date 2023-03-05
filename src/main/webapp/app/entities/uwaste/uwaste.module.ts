import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UwasteComponent } from './list/uwaste.component';
import { UwasteDetailComponent } from './detail/uwaste-detail.component';
import { UwasteUpdateComponent } from './update/uwaste-update.component';
import { UwasteDeleteDialogComponent } from './delete/uwaste-delete-dialog.component';
import { UwasteRoutingModule } from './route/uwaste-routing.module';

@NgModule({
  imports: [SharedModule, UwasteRoutingModule],
  declarations: [UwasteComponent, UwasteDetailComponent, UwasteUpdateComponent, UwasteDeleteDialogComponent],
})
export class UwasteModule {}
