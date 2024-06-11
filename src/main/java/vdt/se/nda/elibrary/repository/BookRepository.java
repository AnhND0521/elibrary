package vdt.se.nda.elibrary.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Book;

/**
 * Spring Data JPA repository for the Book entity.
 * <p>
 * When extending this class, extend BookRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface BookRepository extends BookRepositoryWithBagRelationships, JpaRepository<Book, Long> {
    default Optional<Book> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Book> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Book> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct book from Book book left join fetch book.category",
        countQuery = "select count(distinct book) from Book book"
    )
    Page<Book> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct book from Book book left join fetch book.category")
    List<Book> findAllWithToOneRelationships();

    @Query("select book from Book book left join fetch book.category where book.id =:id")
    Optional<Book> findOneWithToOneRelationships(@Param("id") Long id);

    boolean existsByTitle(String title);

    Page<Book> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Book> findByAuthorsId(Long authorId, Pageable pageable);

    Page<Book> findDistinctByCopiesPublisherId(Long publisherId, Pageable pageable);

    @Query(
        "select distinct book from Book book " +
        "left join book.category category " +
        "left join book.authors author " +
        "left join book.copies copy " +
        "where lower(book.title) like lower(concat('%', ?1, '%')) " +
        "or lower(category.name) like lower(concat('%', ?1, '%')) " +
        "or lower(author.name) like lower(concat('%', ?1, '%')) " +
        "or lower(copy.title) like lower(concat('%', ?1, '%'))"
    )
    Page<Book> findByKeyword(String keyword, Pageable pageable);

    @Query(
        "select distinct book from Book book " +
        "left join book.category category " +
        "left join book.authors author " +
        "left join book.copies copy " +
        "where (COALESCE(:categoryIds) is null or category.id in :categoryIds) " +
        "and (COALESCE(:authorIds) is null or author.id in :authorIds) " +
        "and (lower(book.title) like lower(concat('%', :keyword, '%')) " +
        "or lower(category.name) like lower(concat('%', :keyword, '%')) " +
        "or lower(author.name) like lower(concat('%', :keyword, '%')) " +
        "or lower(copy.title) like lower(concat('%', :keyword, '%'))) "
    )
    Page<Book> findByKeywordAndCategoryIdInAndAuthorsIdIn(
        @Param("keyword") String keyword,
        @Param("categoryIds") List<Long> categoryIds,
        @Param("authorIds") List<Long> authorIds,
        Pageable pageable
    );
}
