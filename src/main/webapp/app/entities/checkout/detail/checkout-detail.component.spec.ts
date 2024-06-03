import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CheckoutDetailComponent } from './checkout-detail.component';

describe('Checkout Management Detail Component', () => {
  let comp: CheckoutDetailComponent;
  let fixture: ComponentFixture<CheckoutDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ checkout: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CheckoutDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CheckoutDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load checkout on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.checkout).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
