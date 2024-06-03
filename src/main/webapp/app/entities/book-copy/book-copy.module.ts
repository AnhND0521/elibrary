import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BookCopyComponent } from './list/book-copy.component';
import { BookCopyDetailComponent } from './detail/book-copy-detail.component';
import { BookCopyUpdateComponent } from './update/book-copy-update.component';
import { BookCopyDeleteDialogComponent } from './delete/book-copy-delete-dialog.component';
import { BookCopyRoutingModule } from './route/book-copy-routing.module';

@NgModule({
  imports: [SharedModule, BookCopyRoutingModule],
  declarations: [BookCopyComponent, BookCopyDetailComponent, BookCopyUpdateComponent, BookCopyDeleteDialogComponent],
})
export class BookCopyModule {}
