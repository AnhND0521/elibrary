import { Component, OnInit } from '@angular/core';
import { IBookCatalogItem } from './book-catalog.model';
import { BookCatalogService } from './book-catalog.service';
import { IBook } from 'app/entities/book/book.model';
import { Router } from '@angular/router';
import { StringUtilService } from 'app/core/util/string-util.service';

@Component({
  selector: 'jhi-book-catalog',
  templateUrl: './book-catalog.component.html',
  styleUrls: ['./book-catalog.component.scss'],
})
export class BookCatalogComponent implements OnInit {
  catalog: IBookCatalogItem[] = [];
  searchKeyword: string = '';

  constructor(protected router: Router, protected bookCatalogService: BookCatalogService, protected stringUtil: StringUtilService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.bookCatalogService.getTopCategories().subscribe(response => {
      this.catalog = response.body!.map(category => {
        return {
          categoryId: category.id,
          categoryName: category.name!,
        };
      });

      for (let catalogItem of this.catalog) {
        this.bookCatalogService
          .getBooksByCategory({
            id: catalogItem.categoryId,
            page: 0,
            size: 100,
          })
          .subscribe(response => {
            const books: IBook[] = response.body!;

            // slice whole book list to separate slides to be displayed on carousel
            const content: IBook[][] = [];
            const booksPerSlide = 5;
            for (let i = 0; i < books.length; i += booksPerSlide) {
              content.push(books.slice(i, i + booksPerSlide));
            }
            catalogItem.content = content;
          });
      }
    });
  }

  search() {
    this.router.navigateByUrl('/search?q=' + this.searchKeyword.trim());
  }

  getCategoryKey(name: string): string {
    return this.stringUtil.toCamelCase(name);
  }
}
