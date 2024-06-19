import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ASC } from 'app/config/navigation.constants';
import { StringUtilService } from 'app/core/util/string-util.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

@Component({
  selector: 'jhi-category-catalog',
  templateUrl: './category-catalog.component.html',
  styleUrls: ['./category-catalog.component.scss'],
})
export class CategoryCatalogComponent implements OnInit {
  categoryList: ICategory[] = [];
  filteredList: ICategory[] = [];
  filterValue: string = '';

  constructor(
    protected router: Router,
    protected categoryService: CategoryService,
    protected stringUtil: StringUtilService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(value => this.ngOnInit());
    this.categoryService
      .query({
        page: 0,
        size: 100,
        sort: ['name,' + ASC],
      })
      .subscribe(response => {
        this.categoryList = response.body!;
        for (let i = 0; i < this.categoryList.length; i++) {
          this.translate
            .get('categories.' + this.getCategoryKey(this.categoryList[i].name!))
            .subscribe(name => (this.categoryList[i].name = name));
        }
        this.categoryList.sort((c1, c2) => c1.name!.localeCompare(c2.name!));
        this.filteredList = this.categoryList;
      });
  }

  filter(): void {
    this.filteredList = this.categoryList.filter(c => c.name!.toLowerCase().includes(this.filterValue.toLowerCase()));
  }

  getCategoryKey(name: string): string {
    return this.stringUtil.toCamelCase(name);
  }
}
