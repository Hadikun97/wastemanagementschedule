import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBulletin } from '../bulletin.model';
import { BulletinService } from '../service/bulletin.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './bulletin-delete-dialog.component.html',
})
export class BulletinDeleteDialogComponent {
  bulletin?: IBulletin;

  constructor(protected bulletinService: BulletinService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bulletinService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
