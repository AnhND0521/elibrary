import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICheckout } from '../checkout.model';

@Component({
  selector: 'jhi-checkout-detail',
  templateUrl: './checkout-detail.component.html',
})
export class CheckoutDetailComponent implements OnInit {
  checkout: ICheckout | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkout }) => {
      this.checkout = checkout;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
