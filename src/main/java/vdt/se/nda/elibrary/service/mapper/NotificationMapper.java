package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.Notification;
import vdt.se.nda.elibrary.domain.PatronAccount;
import vdt.se.nda.elibrary.service.dto.NotificationDTO;
import vdt.se.nda.elibrary.service.dto.PatronAccountDTO;

/**
 * Mapper for the entity {@link Notification} and its DTO {@link NotificationDTO}.
 */
@Mapper(componentModel = "spring")
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {
    @Mapping(target = "patron", source = "patron", qualifiedByName = "patronAccountCardNumber")
    NotificationDTO toDto(Notification s);

    @Named("patronAccountCardNumber")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "cardNumber", source = "cardNumber")
    PatronAccountDTO toDtoPatronAccountCardNumber(PatronAccount patronAccount);
}
