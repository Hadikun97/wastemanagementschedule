import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOnDuty } from '../on-duty.model';

@Component({
  selector: 'jhi-on-duty-detail',
  templateUrl: './on-duty-detail.component.html',
})
export class OnDutyDetailComponent implements OnInit {
  onDuty: IOnDuty | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ onDuty }) => {
      this.onDuty = onDuty;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
