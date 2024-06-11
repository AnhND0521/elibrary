import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookSearchService } from './book-search.service';
import { IBook } from 'app/entities/book/book.model';
import { HttpResponse } from '@angular/common/http';
import { TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ICategory } from 'app/entities/category/category.model';
import { IAuthor } from 'app/entities/author/author.model';
import { ASC } from 'app/config/navigation.constants';
import { AUTHOR, CATEGORY, PUBLISHER } from './book-search.constants';

type ICategoryWithMark = ICategory & { selected?: boolean };
type IAuthorWithMark = IAuthor & { selected?: boolean };

@Component({
  selector: 'jhi-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit {
  queryKeyword: string = '';
  queryCategoryIds: number[] = [];
  queryAuthorIds: number[] = [];

  title: string = '';
  keyword: string = '';
  bookList: IBook[] = [];
  categoryList: ICategoryWithMark[] = [];
  authorList: IAuthorWithMark[] = [];

  selectedCategories: ICategoryWithMark[] = [];
  selectedAuthors: IAuthorWithMark[] = [];

  itemsPerPage: number = 30;
  totalItems: number = 0;
  page: number = 1;

  allowedSubjectTypes: string[] = [CATEGORY, AUTHOR, PUBLISHER];
  subjectType: string = '';
  subjectId: number = 0;
  subjectName: string = '';
  titlePrefixes: any = {};

  constructor(private route: ActivatedRoute, private router: Router, private bookSearchService: BookSearchService) {
    this.titlePrefixes[CATEGORY] = 'Thể loại: ';
    this.titlePrefixes[AUTHOR] = 'Tác giả: ';
    this.titlePrefixes[PUBLISHER] = 'Nhà xuất bản: ';
  }

  ngOnInit(): void {
    this.fetchCategoryList();
    this.fetchAuthorList();
    this.fetchSearchResults();
  }

  fetchSearchResults() {
    this.route.queryParams.subscribe(params => {
      this.subjectType = '';
      this.title = 'Kết quả tìm kiếm: ' + this.keyword;

      // check if this page is book list of any subjects
      for (let subjectType of this.allowedSubjectTypes) {
        if (params[subjectType]) {
          this.subjectType = subjectType;
          this.subjectId = +params[subjectType];
          this.bookSearchService
            .getBySubject(subjectType, { id: this.subjectId, page: this.page - 1, size: this.itemsPerPage })
            .subscribe(response => this.extractBookList(response));
          this.bookSearchService.getSubject(subjectType, this.subjectId).subscribe(response => {
            this.subjectName = response.body!.name!;
            this.title = this.titlePrefixes[subjectType] + this.subjectName;
          });
          return;
        }
      }

      // is normal search page
      if (params['q']) {
        this.queryKeyword = params['q'].trim();
        this.keyword = this.queryKeyword;
      } else {
        this.queryKeyword = '';
        this.keyword = '';
      }

      if (params['categories']) {
        this.queryCategoryIds = params['categories'].split(',').map((e: string) => +e);
        if (this.categoryList.length > 0) this.selectedCategories = this.categoryList.filter(c => this.queryCategoryIds.includes(c.id));
      } else {
        this.queryCategoryIds = [];
        this.selectedCategories = [];
      }

      if (params['authors']) {
        this.queryAuthorIds = params['authors'].split(',').map((e: string) => +e);
        if (this.authorList.length > 0) this.selectedAuthors = this.authorList.filter(a => this.queryAuthorIds.includes(a.id));
      } else {
        this.queryAuthorIds = [];
        this.selectedAuthors = [];
      }

      this.bookSearchService.search(this.buildSearchParams()).subscribe(response => this.extractBookList(response));
    });
  }

  buildSearchParams() {
    const searchParams: any = {
      q: this.keyword,
      page: this.page - 1,
      size: this.itemsPerPage,
    };
    if (this.queryCategoryIds.length > 0) {
      searchParams.categories = this.queryCategoryIds.join(',');
    }
    if (this.queryAuthorIds.length > 0) {
      searchParams.authors = this.queryAuthorIds.join(',');
    }
    return searchParams;
  }

  fetchCategoryList() {
    this.bookSearchService.getCategories({ page: 0, size: 100, sort: ['name,' + ASC] }).subscribe(response => {
      this.categoryList = response.body!;
      if (this.queryCategoryIds.length > 0) this.selectedCategories = this.categoryList.filter(c => this.queryCategoryIds.includes(c.id));
    });
  }

  fetchAuthorList() {
    this.bookSearchService.getAuthors({ page: 0, size: 10000, sort: ['name,' + ASC] }).subscribe(response => {
      this.authorList = response.body!;
      if (this.queryAuthorIds.length > 0) this.selectedAuthors = this.authorList.filter(c => this.queryAuthorIds.includes(c.id));
    });
  }

  extractBookList(response: HttpResponse<IBook[]>): void {
    this.bookList = response.body!;
    this.totalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  filterUnselected(list: any[]) {
    return list.filter(e => !e.selected);
  }

  addCategory(event: any) {
    console.log(event.target.value);
    const id = +event.target.value.split(' - ')[1];
    const index = this.categoryList.findIndex(c => c.id === id);
    this.categoryList[index].selected = true;
    this.selectedCategories.push(this.categoryList[index]);
    event.target.value = '';
  }

  removeCategory(category: ICategoryWithMark) {
    console.log(category);
    const index1 = this.selectedCategories.findIndex(c => c.id === category.id);
    this.selectedCategories.splice(index1, 1);

    const index2 = this.categoryList.findIndex(c => c.id === category.id);
    this.categoryList[index2].selected = false;
  }

  addAuthor(event: any) {
    console.log(event.target.value);
    const id = +event.target.value.split(' - ')[1];
    const index = this.authorList.findIndex(a => a.id === id);
    this.authorList[index].selected = true;
    this.selectedAuthors.push(this.authorList[index]);
    event.target.value = '';
  }

  removeAuthor(author: IAuthorWithMark) {
    console.log(author);
    const index1 = this.selectedAuthors.findIndex(a => a.id === author.id);
    this.selectedAuthors.splice(index1, 1);

    const index2 = this.authorList.findIndex(a => a.id === author.id);
    this.authorList[index2].selected = false;
  }

  search(): void {
    const keywordParam = 'q=' + this.keyword.trim();
    const categoriesParam =
      this.selectedCategories.length === 0 ? '' : '&categories=' + this.selectedCategories.map(c => '' + c.id).join(',');
    const authorsParam = this.selectedAuthors.length === 0 ? '' : '&authors=' + this.selectedAuthors.map(a => '' + a.id).join(',');
    const url = '/search?' + keywordParam + categoriesParam + authorsParam;
    this.router.navigateByUrl(url);
  }

  navigateToPage(page: number) {
    this.page = page;

    if (!this.subjectType) {
      this.bookSearchService.search(this.buildSearchParams()).subscribe(response => this.extractBookList(response));
    } else {
      this.bookSearchService
        .getBySubject(this.subjectType, { id: this.subjectId, page: this.page - 1, size: this.itemsPerPage })
        .subscribe(response => this.extractBookList(response));
    }
  }
}
