import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';

interface ILink {
  routerLink: string;
  label: string;
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
      label: 'Danh mục sách',
    },
    {
      routerLink: '/search',
      label: 'Tìm kiếm sách',
    },
    {
      routerLink: '/history',
      label: 'Lịch sử',
    },
    {
      routerLink: '/waitlist',
      label: 'Danh sách chờ',
    },
  ];

  constructor(protected accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.isSidebarCollapsed = account == null;
    });
  }
}
