import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOnDuty } from '../on-duty.model';
import { OnDutyService } from '../service/on-duty.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './on-duty-delete-dialog.component.html',
})
export class OnDutyDeleteDialogComponent {
  onDuty?: IOnDuty;

  constructor(protected onDutyService: OnDutyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.onDutyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
