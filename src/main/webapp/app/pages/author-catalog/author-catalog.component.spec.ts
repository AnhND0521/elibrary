import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorCatalogComponent } from './author-catalog.component';

describe('AuthorCatalogComponent', () => {
  let component: AuthorCatalogComponent;
  let fixture: ComponentFixture<AuthorCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
