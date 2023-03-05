import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ScheduleFormService, ScheduleFormGroup } from './schedule-form.service';
import { ISchedule } from '../schedule.model';
import { ScheduleService } from '../service/schedule.service';
import { IOnDuty } from 'app/entities/on-duty/on-duty.model';
import { OnDutyService } from 'app/entities/on-duty/service/on-duty.service';
import { States } from 'app/entities/enumerations/states.model';
import { Activities } from 'app/entities/enumerations/activities.model';
import { Days } from 'app/entities/enumerations/days.model';

@Component({
  selector: 'jhi-schedule-update',
  templateUrl: './schedule-update.component.html',
})
export class ScheduleUpdateComponent implements OnInit {
  isSaving = false;
  schedule: ISchedule | null = null;
  statesValues = Object.keys(States);
  activitiesValues = Object.keys(Activities);
  daysValues = Object.keys(Days);

  onDutiesSharedCollection: IOnDuty[] = [];

  editForm: ScheduleFormGroup = this.scheduleFormService.createScheduleFormGroup();

  constructor(
    protected scheduleService: ScheduleService,
    protected scheduleFormService: ScheduleFormService,
    protected onDutyService: OnDutyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOnDuty = (o1: IOnDuty | null, o2: IOnDuty | null): boolean => this.onDutyService.compareOnDuty(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ schedule }) => {
      this.schedule = schedule;
      if (schedule) {
        this.updateForm(schedule);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const schedule = this.scheduleFormService.getSchedule(this.editForm);
    if (schedule.id !== null) {
      this.subscribeToSaveResponse(this.scheduleService.update(schedule));
    } else {
      this.subscribeToSaveResponse(this.scheduleService.create(schedule));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISchedule>>): void {
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

  protected updateForm(schedule: ISchedule): void {
    this.schedule = schedule;
    this.scheduleFormService.resetForm(this.editForm, schedule);

    this.onDutiesSharedCollection = this.onDutyService.addOnDutyToCollectionIfMissing<IOnDuty>(
      this.onDutiesSharedCollection,
      schedule.onDuty
    );
  }

  protected loadRelationshipsOptions(): void {
    this.onDutyService
      .query()
      .pipe(map((res: HttpResponse<IOnDuty[]>) => res.body ?? []))
      .pipe(map((onDuties: IOnDuty[]) => this.onDutyService.addOnDutyToCollectionIfMissing<IOnDuty>(onDuties, this.schedule?.onDuty)))
      .subscribe((onDuties: IOnDuty[]) => (this.onDutiesSharedCollection = onDuties));
  }
}
