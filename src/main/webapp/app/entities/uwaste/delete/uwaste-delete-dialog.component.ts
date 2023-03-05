import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUwaste } from '../uwaste.model';
import { UwasteService } from '../service/uwaste.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './uwaste-delete-dialog.component.html',
})
export class UwasteDeleteDialogComponent {
  uwaste?: IUwaste;

  constructor(protected uwasteService: UwasteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.uwasteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
