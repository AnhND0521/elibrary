package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.Publisher;
import vdt.se.nda.elibrary.service.dto.PublisherDTO;

/**
 * Mapper for the entity {@link Publisher} and its DTO {@link PublisherDTO}.
 */
@Mapper(componentModel = "spring")
public interface PublisherMapper extends EntityMapper<PublisherDTO, Publisher> {}
