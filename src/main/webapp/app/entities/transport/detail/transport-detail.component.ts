import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITransport } from '../transport.model';

@Component({
  selector: 'jhi-transport-detail',
  templateUrl: './transport-detail.component.html',
})
export class TransportDetailComponent implements OnInit {
  transport: ITransport | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transport }) => {
      this.transport = transport;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
