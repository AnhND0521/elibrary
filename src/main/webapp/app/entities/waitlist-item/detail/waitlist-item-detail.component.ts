import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWaitlistItem } from '../waitlist-item.model';

@Component({
  selector: 'jhi-waitlist-item-detail',
  templateUrl: './waitlist-item-detail.component.html',
})
export class WaitlistItemDetailComponent implements OnInit {
  waitlistItem: IWaitlistItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ waitlistItem }) => {
      this.waitlistItem = waitlistItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
