package vdt.se.nda.elibrary.service.mapper;

import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;
import vdt.se.nda.elibrary.domain.Author;
import vdt.se.nda.elibrary.domain.Book;
import vdt.se.nda.elibrary.domain.Category;
import vdt.se.nda.elibrary.service.dto.AuthorDTO;
import vdt.se.nda.elibrary.service.dto.BookDTO;
import vdt.se.nda.elibrary.service.dto.CategoryDTO;

/**
 * Mapper for the entity {@link Book} and its DTO {@link BookDTO}.
 */
@Mapper(componentModel = "spring")
public interface BookMapper extends EntityMapper<BookDTO, Book> {
    @Mapping(target = "category", source = "category", qualifiedByName = "categoryName")
    @Mapping(target = "authors", source = "authors", qualifiedByName = "authorNameSet")
    BookDTO toDto(Book s);

    @Mapping(target = "removeAuthor", ignore = true)
    Book toEntity(BookDTO bookDTO);

    @Named("categoryName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    CategoryDTO toDtoCategoryName(Category category);

    @Named("authorName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    AuthorDTO toDtoAuthorName(Author author);

    @Named("authorNameSet")
    default Set<AuthorDTO> toDtoAuthorNameSet(Set<Author> author) {
        return author.stream().map(this::toDtoAuthorName).collect(Collectors.toSet());
    }
}
