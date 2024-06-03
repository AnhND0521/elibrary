package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.Book;
import vdt.se.nda.elibrary.domain.BookCopy;
import vdt.se.nda.elibrary.domain.Publisher;
import vdt.se.nda.elibrary.service.dto.BookCopyDTO;
import vdt.se.nda.elibrary.service.dto.BookDTO;
import vdt.se.nda.elibrary.service.dto.PublisherDTO;

/**
 * Mapper for the entity {@link BookCopy} and its DTO {@link BookCopyDTO}.
 */
@Mapper(componentModel = "spring")
public interface BookCopyMapper extends EntityMapper<BookCopyDTO, BookCopy> {
    @Mapping(target = "book", source = "book", qualifiedByName = "bookTitle")
    @Mapping(target = "publisher", source = "publisher", qualifiedByName = "publisherName")
    BookCopyDTO toDto(BookCopy s);

    @Named("bookTitle")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    BookDTO toDtoBookTitle(Book book);

    @Named("publisherName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    PublisherDTO toDtoPublisherName(Publisher publisher);
}
