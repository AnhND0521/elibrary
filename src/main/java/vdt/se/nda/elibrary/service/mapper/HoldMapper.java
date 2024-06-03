package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.BookCopy;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.domain.PatronAccount;
import vdt.se.nda.elibrary.service.dto.BookCopyDTO;
import vdt.se.nda.elibrary.service.dto.HoldDTO;
import vdt.se.nda.elibrary.service.dto.PatronAccountDTO;

/**
 * Mapper for the entity {@link Hold} and its DTO {@link HoldDTO}.
 */
@Mapper(componentModel = "spring")
public interface HoldMapper extends EntityMapper<HoldDTO, Hold> {
    @Mapping(target = "copy", source = "copy", qualifiedByName = "bookCopyId")
    @Mapping(target = "patron", source = "patron", qualifiedByName = "patronAccountCardNumber")
    HoldDTO toDto(Hold s);

    @Named("bookCopyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BookCopyDTO toDtoBookCopyId(BookCopy bookCopy);

    @Named("patronAccountCardNumber")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "cardNumber", source = "cardNumber")
    PatronAccountDTO toDtoPatronAccountCardNumber(PatronAccount patronAccount);
}
