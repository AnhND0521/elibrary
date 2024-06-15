import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookSearchService } from './book-search.service';
import { IBook } from 'app/entities/book/book.model';
import { HttpResponse } from '@angular/common/http';
import { TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ICategory } from 'app/entities/category/category.model';
import { IAuthor } from 'app/entities/author/author.model';
import { ASC } from 'app/config/navigation.constants';
import { ALL, AUTHOR, CATEGORY, PUBLISHER, getPluralForm } from './book-search.constants';
import { TranslateService } from '@ngx-translate/core';
import { StringUtilService } from 'app/core/util/string-util.service';

type ICategoryWithMark = ICategory & { selected?: boolean };
type IAuthorWithMark = IAuthor & { selected?: boolean };

type Filter = { name: string; list: any[]; queryIds: number[]; selectedValues: any[] };

@Component({
  selector: 'jhi-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit {
  queryKeyword: string = '';

  title: string = '';
  keyword: string = '';
  bookList: IBook[] = [];

  itemsPerPage: number = 30;
  totalItems: number = 0;
  page: number = 1;

  labels: any = {};

  filters: Filter[] = [CATEGORY, AUTHOR].map(name => {
    return { name: name, list: [], queryIds: [], selectedValues: [] };
  });

  allowedSubjectTypes: string[] = ALL;
  subjectType: string = '';
  subjectId: number = 0;
  subjectName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookSearchService: BookSearchService,
    private translate: TranslateService,
    private stringUtil: StringUtilService
  ) {
    ALL.forEach(value => translate.get('eLibraryApp.bookSearch.filter.' + value).subscribe(label => (this.labels[value] = label)));
  }

  ngOnInit(): void {
    this.filters.forEach((filter, i) => {
      this.fetchFilterValues(i);
    });
    this.fetchSearchResults();
    this.translate.onLangChange.subscribe(value => {
      this.fetchFilterValues(this.filters.findIndex(f => f.name === CATEGORY));
    });
  }

  fetchSearchResults() {
    this.route.queryParams.subscribe(params => {
      this.subjectType = '';
      this.translate.get('eLibraryApp.bookSearch.searchResult').subscribe(label => (this.title = label + this.keyword));

      // check if this page is book list of any subjects
      this.allowedSubjectTypes.forEach(subjectType => {
        if (params[subjectType]) {
          this.subjectType = subjectType;
          this.subjectId = +params[subjectType];
          this.bookSearchService
            .getBySubject(subjectType, { id: this.subjectId, page: this.page - 1, size: this.itemsPerPage })
            .subscribe(response => this.extractBookList(response));
          this.bookSearchService.getSubject(subjectType, this.subjectId).subscribe(response => {
            this.subjectName = response.body!.name!;
            if (this.subjectType === CATEGORY) {
              this.translate
                .get('categories.' + this.stringUtil.toCamelCase(this.subjectName))
                .subscribe(categoryName => (this.title = this.labels[subjectType] + ': ' + categoryName));
            } else this.title = this.labels[subjectType] + ': ' + this.subjectName;
          });
        }
      });
      if (this.subjectType) return;

      // is normal search page
      if (params['q']) {
        this.queryKeyword = params['q'].trim();
        this.keyword = this.queryKeyword;
      } else {
        this.queryKeyword = '';
        this.keyword = '';
      }

      this.filters.forEach((filter, i) => {
        const pluralName = getPluralForm(filter.name);
        if (params[pluralName]) {
          this.filters[i].queryIds = params[pluralName].split(',').map((v: string) => +v);
          if (filter.list.length > 0) this.filters[i].selectedValues = filter.list.filter(c => filter.queryIds.includes(c.id));
        } else {
          this.filters[i].queryIds = [];
          this.filters[i].selectedValues = [];
        }
      });

      this.bookSearchService.search(this.buildSearchParams()).subscribe(response => this.extractBookList(response));
    });
  }

  buildSearchParams() {
    const searchParams: any = {
      q: this.keyword,
      page: this.page - 1,
      size: this.itemsPerPage,
    };

    this.filters.forEach(filter => {
      if (filter.queryIds.length > 0) {
        searchParams[getPluralForm(filter.name)] = filter.queryIds.join(',');
      }
    });

    return searchParams;
  }

  fetchFilterValues(i: number) {
    this.bookSearchService.getSubjectList(this.filters[i].name, { page: 0, size: 100000, sort: ['name,' + ASC] }).subscribe(response => {
      this.filters[i].list = response.body!;
      if (this.filters[i].name === CATEGORY) {
        for (let j = 0; j < this.filters[i].list.length; j++) {
          this.translate
            .get('categories.' + this.stringUtil.toCamelCase(this.filters[i].list[j].name))
            .subscribe(name => (this.filters[i].list[j].name = name));
        }
        this.filters[i].list.sort((c1, c2) => c1.name!.localeCompare(c2.name!));
      }
      if (this.filters[i].queryIds.length > 0)
        this.filters[i].selectedValues = this.filters[i].list.filter(v => this.filters[i].queryIds.includes(v.id));
    });
  }

  extractBookList(response: HttpResponse<IBook[]>): void {
    this.bookList = response.body!;
    this.totalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  filterUnselected(list: any[]) {
    return list.filter(e => !e.selected);
  }

  addFilterValue(event: any, filterIndex: number) {
    console.log(event.target.value);
    const id = +event.target.value.split(' - ')[1];
    const index = this.filters[filterIndex].list.findIndex(c => c.id === id);
    this.filters[filterIndex].list[index].selected = true;
    this.filters[filterIndex].selectedValues.push(this.filters[filterIndex].list[index]);
    event.target.value = '';
  }

  removeFilterValue(value: any, filterIndex: number) {
    console.log(value);
    const index1 = this.filters[filterIndex].selectedValues.findIndex(v => v.id === value.id);
    this.filters[filterIndex].selectedValues.splice(index1, 1);

    const index2 = this.filters[filterIndex].list.findIndex(v => v.id === value.id);
    this.filters[filterIndex].list[index2].selected = false;
  }

  search(): void {
    const keywordParam = 'q=' + this.keyword.trim();
    let url = '/search?' + keywordParam;

    this.filters.forEach(filter => {
      url +=
        filter.selectedValues.length === 0 ? '' : `&${getPluralForm(filter.name)}=` + filter.selectedValues.map(v => '' + v.id).join(',');
    });

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
