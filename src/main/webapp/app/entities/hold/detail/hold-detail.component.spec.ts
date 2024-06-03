import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HoldDetailComponent } from './hold-detail.component';

describe('Hold Management Detail Component', () => {
  let comp: HoldDetailComponent;
  let fixture: ComponentFixture<HoldDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoldDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ hold: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HoldDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HoldDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load hold on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.hold).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
