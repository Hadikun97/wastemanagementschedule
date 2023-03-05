import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OnDutyFormService, OnDutyFormGroup } from './on-duty-form.service';
import { IOnDuty } from '../on-duty.model';
import { OnDutyService } from '../service/on-duty.service';
import { IStaff } from 'app/entities/staff/staff.model';
import { StaffService } from 'app/entities/staff/service/staff.service';
import { ITransport } from 'app/entities/transport/transport.model';
import { TransportService } from 'app/entities/transport/service/transport.service';

@Component({
  selector: 'jhi-on-duty-update',
  templateUrl: './on-duty-update.component.html',
})
export class OnDutyUpdateComponent implements OnInit {
  isSaving = false;
  onDuty: IOnDuty | null = null;

  staffSharedCollection: IStaff[] = [];
  transportsSharedCollection: ITransport[] = [];

  editForm: OnDutyFormGroup = this.onDutyFormService.createOnDutyFormGroup();

  constructor(
    protected onDutyService: OnDutyService,
    protected onDutyFormService: OnDutyFormService,
    protected staffService: StaffService,
    protected transportService: TransportService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareStaff = (o1: IStaff | null, o2: IStaff | null): boolean => this.staffService.compareStaff(o1, o2);

  compareTransport = (o1: ITransport | null, o2: ITransport | null): boolean => this.transportService.compareTransport(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ onDuty }) => {
      this.onDuty = onDuty;
      if (onDuty) {
        this.updateForm(onDuty);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const onDuty = this.onDutyFormService.getOnDuty(this.editForm);
    if (onDuty.id !== null) {
      this.subscribeToSaveResponse(this.onDutyService.update(onDuty));
    } else {
      this.subscribeToSaveResponse(this.onDutyService.create(onDuty));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOnDuty>>): void {
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

  protected updateForm(onDuty: IOnDuty): void {
    this.onDuty = onDuty;
    this.onDutyFormService.resetForm(this.editForm, onDuty);

    this.staffSharedCollection = this.staffService.addStaffToCollectionIfMissing<IStaff>(this.staffSharedCollection, onDuty.staff);
    this.transportsSharedCollection = this.transportService.addTransportToCollectionIfMissing<ITransport>(
      this.transportsSharedCollection,
      onDuty.transport
    );
  }

  protected loadRelationshipsOptions(): void {
    this.staffService
      .query()
      .pipe(map((res: HttpResponse<IStaff[]>) => res.body ?? []))
      .pipe(map((staff: IStaff[]) => this.staffService.addStaffToCollectionIfMissing<IStaff>(staff, this.onDuty?.staff)))
      .subscribe((staff: IStaff[]) => (this.staffSharedCollection = staff));

    this.transportService
      .query()
      .pipe(map((res: HttpResponse<ITransport[]>) => res.body ?? []))
      .pipe(
        map((transports: ITransport[]) =>
          this.transportService.addTransportToCollectionIfMissing<ITransport>(transports, this.onDuty?.transport)
        )
      )
      .subscribe((transports: ITransport[]) => (this.transportsSharedCollection = transports));
  }
}
