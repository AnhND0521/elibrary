import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BookFormService } from './book-form.service';
import { BookService } from '../service/book.service';
import { IBook } from '../book.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';

import { BookUpdateComponent } from './book-update.component';

describe('Book Management Update Component', () => {
  let comp: BookUpdateComponent;
  let fixture: ComponentFixture<BookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookFormService: BookFormService;
  let bookService: BookService;
  let categoryService: CategoryService;
  let authorService: AuthorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BookUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookFormService = TestBed.inject(BookFormService);
    bookService = TestBed.inject(BookService);
    categoryService = TestBed.inject(CategoryService);
    authorService = TestBed.inject(AuthorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const book: IBook = { id: 456 };
      const category: ICategory = { id: 27863 };
      book.category = category;

      const categoryCollection: ICategory[] = [{ id: 61074 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [category];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining)
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Author query and add missing value', () => {
      const book: IBook = { id: 456 };
      const authors: IAuthor[] = [{ id: 47336 }];
      book.authors = authors;

      const authorCollection: IAuthor[] = [{ id: 29185 }];
      jest.spyOn(authorService, 'query').mockReturnValue(of(new HttpResponse({ body: authorCollection })));
      const additionalAuthors = [...authors];
      const expectedCollection: IAuthor[] = [...additionalAuthors, ...authorCollection];
      jest.spyOn(authorService, 'addAuthorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(authorService.query).toHaveBeenCalled();
      expect(authorService.addAuthorToCollectionIfMissing).toHaveBeenCalledWith(
        authorCollection,
        ...additionalAuthors.map(expect.objectContaining)
      );
      expect(comp.authorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const book: IBook = { id: 456 };
      const category: ICategory = { id: 28290 };
      book.category = category;
      const author: IAuthor = { id: 5685 };
      book.authors = [author];

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(comp.categoriesSharedCollection).toContain(category);
      expect(comp.authorsSharedCollection).toContain(author);
      expect(comp.book).toEqual(book);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 123 };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue(book);
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookService.update).toHaveBeenCalledWith(expect.objectContaining(book));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 123 };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue({ id: null });
      jest.spyOn(bookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(bookService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 123 };
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCategory', () => {
      it('Should forward to categoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoryService, 'compareCategory');
        comp.compareCategory(entity, entity2);
        expect(categoryService.compareCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAuthor', () => {
      it('Should forward to authorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(authorService, 'compareAuthor');
        comp.compareAuthor(entity, entity2);
        expect(authorService.compareAuthor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
