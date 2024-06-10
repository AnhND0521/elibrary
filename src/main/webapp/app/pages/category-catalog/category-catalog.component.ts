import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ASC } from 'app/config/navigation.constants';
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

  constructor(protected router: Router, protected categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService
      .query({
        page: 0,
        size: 100,
        sort: ['name,' + ASC],
      })
      .subscribe(response => {
        this.categoryList = response.body!;
        this.filteredList = this.categoryList;
      });
  }

  filter(): void {
    this.filteredList = this.categoryList.filter(c => c.name!.toLowerCase().includes(this.filterValue.toLowerCase()));
  }
}
