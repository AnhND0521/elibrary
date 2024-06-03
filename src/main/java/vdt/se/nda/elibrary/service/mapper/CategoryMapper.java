package vdt.se.nda.elibrary.service.mapper;

import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.Category;
import vdt.se.nda.elibrary.service.dto.CategoryDTO;

/**
 * Mapper for the entity {@link Category} and its DTO {@link CategoryDTO}.
 */
@Mapper(componentModel = "spring")
public interface CategoryMapper extends EntityMapper<CategoryDTO, Category> {}
