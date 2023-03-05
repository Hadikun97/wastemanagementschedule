import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TransportFormService, TransportFormGroup } from './transport-form.service';
import { ITransport } from '../transport.model';
import { TransportService } from '../service/transport.service';
import { Types } from 'app/entities/enumerations/types.model';

@Component({
  selector: 'jhi-transport-update',
  templateUrl: './transport-update.component.html',
})
export class TransportUpdateComponent implements OnInit {
  isSaving = false;
  transport: ITransport | null = null;
  typesValues = Object.keys(Types);

  editForm: TransportFormGroup = this.transportFormService.createTransportFormGroup();

  constructor(
    protected transportService: TransportService,
    protected transportFormService: TransportFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transport }) => {
      this.transport = transport;
      if (transport) {
        this.updateForm(transport);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transport = this.transportFormService.getTransport(this.editForm);
    if (transport.id !== null) {
      this.subscribeToSaveResponse(this.transportService.update(transport));
    } else {
      this.subscribeToSaveResponse(this.transportService.create(transport));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransport>>): void {
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

  protected updateForm(transport: ITransport): void {
    this.transport = transport;
    this.transportFormService.resetForm(this.editForm, transport);
  }
}
