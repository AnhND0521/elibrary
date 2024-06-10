import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ASC } from 'app/config/navigation.constants';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';

@Component({
  selector: 'jhi-author-catalog',
  templateUrl: './author-catalog.component.html',
  styleUrls: ['./author-catalog.component.scss'],
})
export class AuthorCatalogComponent implements OnInit {
  authorList: IAuthor[] = [];
  filteredList: IAuthor[] = [];
  displayList: IAuthor[] = [];
  filterValue: string = '';

  page: number = 1;
  itemsPerPage: number = 120;
  totalItems: number = 0;

  constructor(protected router: Router, protected authorService: AuthorService) {}

  ngOnInit(): void {
    this.authorService
      .query({
        page: 0,
        size: 10000,
        sort: ['name,' + ASC],
      })
      .subscribe(response => {
        this.authorList = response.body!;
        this.filteredList = this.authorList;
        this.totalItems = this.filteredList.length;
        this.updateDisplayList();
      });
  }

  filter(): void {
    this.filteredList = this.authorList.filter(a => a.name!.toLowerCase().includes(this.filterValue.toLowerCase()));
    this.totalItems = this.filteredList.length;
    this.page = 1;
    this.updateDisplayList();
  }

  navigateToPage(page: number) {
    this.page = page;
    this.updateDisplayList();
  }

  updateDisplayList() {
    this.displayList = this.filteredList.slice((this.page - 1) * this.itemsPerPage, this.page * this.itemsPerPage);
  }
}
