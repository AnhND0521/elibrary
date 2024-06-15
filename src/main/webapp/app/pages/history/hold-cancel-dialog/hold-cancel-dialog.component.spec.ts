import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldCancelDialogComponent } from './hold-cancel-dialog.component';

describe('HoldCancelDialogComponent', () => {
  let component: HoldCancelDialogComponent;
  let fixture: ComponentFixture<HoldCancelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoldCancelDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HoldCancelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
