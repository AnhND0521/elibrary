import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PatronAccountDetailComponent } from './patron-account-detail.component';

describe('PatronAccount Management Detail Component', () => {
  let comp: PatronAccountDetailComponent;
  let fixture: ComponentFixture<PatronAccountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatronAccountDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ patronAccount: { cardNumber: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(PatronAccountDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PatronAccountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load patronAccount on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.patronAccount).toEqual(expect.objectContaining({ cardNumber: 'ABC' }));
    });
  });
});
