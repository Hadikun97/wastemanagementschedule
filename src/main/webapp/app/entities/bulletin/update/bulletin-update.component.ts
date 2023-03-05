import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BulletinFormService, BulletinFormGroup } from './bulletin-form.service';
import { IBulletin } from '../bulletin.model';
import { BulletinService } from '../service/bulletin.service';

@Component({
  selector: 'jhi-bulletin-update',
  templateUrl: './bulletin-update.component.html',
})
export class BulletinUpdateComponent implements OnInit {
  isSaving = false;
  bulletin: IBulletin | null = null;

  editForm: BulletinFormGroup = this.bulletinFormService.createBulletinFormGroup();

  constructor(
    protected bulletinService: BulletinService,
    protected bulletinFormService: BulletinFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bulletin }) => {
      this.bulletin = bulletin;
      if (bulletin) {
        this.updateForm(bulletin);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bulletin = this.bulletinFormService.getBulletin(this.editForm);
    if (bulletin.id !== null) {
      this.subscribeToSaveResponse(this.bulletinService.update(bulletin));
    } else {
      this.subscribeToSaveResponse(this.bulletinService.create(bulletin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBulletin>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bulletin: IBulletin): void {
    this.bulletin = bulletin;
    this.bulletinFormService.resetForm(this.editForm, bulletin);
  }
}
