import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUwaste } from '../uwaste.model';

@Component({
  selector: 'jhi-uwaste-detail',
  templateUrl: './uwaste-detail.component.html',
})
export class UwasteDetailComponent implements OnInit {
  uwaste: IUwaste | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ uwaste }) => {
      this.uwaste = uwaste;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
