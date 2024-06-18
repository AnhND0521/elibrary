import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';

interface ILink {
  routerLink: string;
  name: string;
}

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isSidebarCollapsed: boolean = false;

  links: ILink[] = [
    {
      routerLink: '/catalog',
      name: 'bookCatalog',
    },
    {
      routerLink: '/search',
      name: 'bookSearch',
    },
    {
      routerLink: '/history',
      name: 'history',
    },
    {
      routerLink: '/waitlist',
      name: 'waitlist',
    },
  ];

  constructor(protected accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.isSidebarCollapsed = account == null;
    });
  }
}
