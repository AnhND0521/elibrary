import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WaitlistItemDetailComponent } from './waitlist-item-detail.component';

describe('WaitlistItem Management Detail Component', () => {
  let comp: WaitlistItemDetailComponent;
  let fixture: ComponentFixture<WaitlistItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitlistItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ waitlistItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WaitlistItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WaitlistItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load waitlistItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.waitlistItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
