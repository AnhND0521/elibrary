import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPatronAccount } from '../patron-account.model';

@Component({
  selector: 'jhi-patron-account-detail',
  templateUrl: './patron-account-detail.component.html',
})
export class PatronAccountDetailComponent implements OnInit {
  patronAccount: IPatronAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patronAccount }) => {
      this.patronAccount = patronAccount;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
