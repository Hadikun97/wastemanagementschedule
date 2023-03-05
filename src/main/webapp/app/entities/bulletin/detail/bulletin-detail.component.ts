import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBulletin } from '../bulletin.model';

@Component({
  selector: 'jhi-bulletin-detail',
  templateUrl: './bulletin-detail.component.html',
})
export class BulletinDetailComponent implements OnInit {
  bulletin: IBulletin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bulletin }) => {
      this.bulletin = bulletin;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
