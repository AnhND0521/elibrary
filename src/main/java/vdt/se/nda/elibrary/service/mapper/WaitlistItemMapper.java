package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.Book;
import vdt.se.nda.elibrary.domain.PatronAccount;
import vdt.se.nda.elibrary.domain.WaitlistItem;
import vdt.se.nda.elibrary.service.dto.BookDTO;
import vdt.se.nda.elibrary.service.dto.PatronAccountDTO;
import vdt.se.nda.elibrary.service.dto.WaitlistItemDTO;

/**
 * Mapper for the entity {@link WaitlistItem} and its DTO {@link WaitlistItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface WaitlistItemMapper extends EntityMapper<WaitlistItemDTO, WaitlistItem> {
    @Mapping(target = "book", source = "book", qualifiedByName = "bookTitle")
    @Mapping(target = "patron", source = "patron", qualifiedByName = "patronAccountCardNumber")
    WaitlistItemDTO toDto(WaitlistItem s);

    @Named("bookTitle")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    BookDTO toDtoBookTitle(Book book);

    @Named("patronAccountCardNumber")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "cardNumber", source = "cardNumber")
    PatronAccountDTO toDtoPatronAccountCardNumber(PatronAccount patronAccount);
}
