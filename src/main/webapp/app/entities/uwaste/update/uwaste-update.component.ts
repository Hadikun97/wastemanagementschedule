import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UwasteFormService, UwasteFormGroup } from './uwaste-form.service';
import { IUwaste } from '../uwaste.model';
import { UwasteService } from '../service/uwaste.service';

@Component({
  selector: 'jhi-uwaste-update',
  templateUrl: './uwaste-update.component.html',
})
export class UwasteUpdateComponent implements OnInit {
  isSaving = false;
  uwaste: IUwaste | null = null;

  editForm: UwasteFormGroup = this.uwasteFormService.createUwasteFormGroup();

  constructor(
    protected uwasteService: UwasteService,
    protected uwasteFormService: UwasteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ uwaste }) => {
      this.uwaste = uwaste;
      if (uwaste) {
        this.updateForm(uwaste);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const uwaste = this.uwasteFormService.getUwaste(this.editForm);
    if (uwaste.id !== null) {
      this.subscribeToSaveResponse(this.uwasteService.update(uwaste));
    } else {
      this.subscribeToSaveResponse(this.uwasteService.create(uwaste));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUwaste>>): void {
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

  protected updateForm(uwaste: IUwaste): void {
    this.uwaste = uwaste;
    this.uwasteFormService.resetForm(this.editForm, uwaste);
  }
}
