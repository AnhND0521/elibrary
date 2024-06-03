import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHold } from '../hold.model';

@Component({
  selector: 'jhi-hold-detail',
  templateUrl: './hold-detail.component.html',
})
export class HoldDetailComponent implements OnInit {
  hold: IHold | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hold }) => {
      this.hold = hold;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
