package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.BookCopy;
import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.domain.PatronAccount;
import vdt.se.nda.elibrary.service.dto.BookCopyDTO;
import vdt.se.nda.elibrary.service.dto.CheckoutDTO;
import vdt.se.nda.elibrary.service.dto.PatronAccountDTO;

/**
 * Mapper for the entity {@link Checkout} and its DTO {@link CheckoutDTO}.
 */
@Mapper(componentModel = "spring")
public interface CheckoutMapper extends EntityMapper<CheckoutDTO, Checkout> {
    @Mapping(target = "copy", source = "copy", qualifiedByName = "bookCopyId")
    @Mapping(target = "patron", source = "patron", qualifiedByName = "patronAccountCardNumber")
    CheckoutDTO toDto(Checkout s);

    @Named("bookCopyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BookCopyDTO toDtoBookCopyId(BookCopy bookCopy);

    @Named("patronAccountCardNumber")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "cardNumber", source = "cardNumber")
    PatronAccountDTO toDtoPatronAccountCardNumber(PatronAccount patronAccount);
}
