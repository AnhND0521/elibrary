package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.PatronAccount;
import vdt.se.nda.elibrary.domain.User;
import vdt.se.nda.elibrary.service.dto.PatronAccountDTO;
import vdt.se.nda.elibrary.service.dto.UserDTO;

/**
 * Mapper for the entity {@link PatronAccount} and its DTO {@link PatronAccountDTO}.
 */
@Mapper(componentModel = "spring")
public interface PatronAccountMapper extends EntityMapper<PatronAccountDTO, PatronAccount> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    PatronAccountDTO toDto(PatronAccount s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
