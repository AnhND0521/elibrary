package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.Author;
import vdt.se.nda.elibrary.service.dto.AuthorDTO;

/**
 * Mapper for the entity {@link Author} and its DTO {@link AuthorDTO}.
 */
@Mapper(componentModel = "spring")
public interface AuthorMapper extends EntityMapper<AuthorDTO, Author> {}
