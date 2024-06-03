import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BookCopyDetailComponent } from './book-copy-detail.component';

describe('BookCopy Management Detail Component', () => {
  let comp: BookCopyDetailComponent;
  let fixture: ComponentFixture<BookCopyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookCopyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bookCopy: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BookCopyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BookCopyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bookCopy on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bookCopy).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
