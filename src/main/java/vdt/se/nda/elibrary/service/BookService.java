package vdt.se.nda.elibrary.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vdt.se.nda.elibrary.service.dto.BookDTO;

/**
 * Service Interface for managing {@link vdt.se.nda.elibrary.domain.Book}.
 */
public interface BookService {
    /**
     * Save a book.
     *
     * @param bookDTO the entity to save.
     * @return the persisted entity.
     */
    BookDTO save(BookDTO bookDTO);

    /**
     * Updates a book.
     *
     * @param bookDTO the entity to update.
     * @return the persisted entity.
     */
    BookDTO update(BookDTO bookDTO);

    /**
     * Partially updates a book.
     *
     * @param bookDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<BookDTO> partialUpdate(BookDTO bookDTO);

    /**
     * Get all the books.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BookDTO> findAll(Pageable pageable);

    /**
     * Get all the books with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BookDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" book.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<BookDTO> findOne(Long id);

    /**
     * Delete the "id" book.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Find books that belong to some category.
     *
     * @param categoryId the id of the category.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BookDTO> findByCategory(Long categoryId, Pageable pageable);

    /**
     * Find books that are written by some author.
     *
     * @param authorId the id of the author.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BookDTO> findByAuthor(Long authorId, Pageable pageable);

    /**
     * Find books that have any copy published by some publisher.
     *
     * @param publisherId the id of the publisher.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BookDTO> findByPublisher(Long publisherId, Pageable pageable);

    /**
     * Search for books with title, authors or category matching keyword.
     *
     * @param keyword the keyword used to search for books.
     * @param categoryIds the ids of the categories that searched books should belong to.
     * @param authorIds the ids of the authors that searched books should be written by.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BookDTO> search(String keyword, List<Long> categoryIds, List<Long> authorIds, Pageable pageable);
}
