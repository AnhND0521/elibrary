package vdt.se.nda.elibrary.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.Book;
import vdt.se.nda.elibrary.repository.BookRepository;
import vdt.se.nda.elibrary.repository.CategoryRepository;
import vdt.se.nda.elibrary.service.BookService;
import vdt.se.nda.elibrary.service.dto.BookDTO;
import vdt.se.nda.elibrary.service.mapper.BookMapper;

/**
 * Service Implementation for managing {@link Book}.
 */
@Service
@Transactional
public class BookServiceImpl implements BookService {

    private final Logger log = LoggerFactory.getLogger(BookServiceImpl.class);

    private final BookRepository bookRepository;

    private final CategoryRepository categoryRepository;

    private final BookMapper bookMapper;

    public BookServiceImpl(BookRepository bookRepository, CategoryRepository categoryRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.bookMapper = bookMapper;
    }

    @Override
    public BookDTO save(BookDTO bookDTO) {
        log.debug("Request to save Book : {}", bookDTO);
        Book book = bookMapper.toEntity(bookDTO);
        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    @Override
    public BookDTO update(BookDTO bookDTO) {
        log.debug("Request to update Book : {}", bookDTO);
        Book book = bookMapper.toEntity(bookDTO);
        book = bookRepository.save(book);
        return bookMapper.toDto(book);
    }

    @Override
    public Optional<BookDTO> partialUpdate(BookDTO bookDTO) {
        log.debug("Request to partially update Book : {}", bookDTO);

        return bookRepository
            .findById(bookDTO.getId())
            .map(existingBook -> {
                bookMapper.partialUpdate(existingBook, bookDTO);

                return existingBook;
            })
            .map(bookRepository::save)
            .map(bookMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Books");
        return bookRepository.findAll(pageable).map(bookMapper::toDto);
    }

    public Page<BookDTO> findAllWithEagerRelationships(Pageable pageable) {
        return bookRepository.findAllWithEagerRelationships(pageable).map(bookMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BookDTO> findOne(Long id) {
        log.debug("Request to get Book : {}", id);
        return bookRepository.findOneWithEagerRelationships(id).map(bookMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Book : {}", id);
        bookRepository.deleteById(id);
    }

    @Override
    public Page<BookDTO> findByCategory(Long categoryId, String categoryName, Pageable pageable) {
        if (categoryId != null) {
            Page<Book> books = bookRepository.findByCategoryId(categoryId, pageable);
            return books.map(bookMapper::toDto);
        }
        if (categoryName != null) {
            Page<Book> books = bookRepository.findByCategoryName(categoryName, pageable);
            return books.map(bookMapper::toDto);
        }
        return null;
    }

    @Override
    public Page<BookDTO> search(String keyword, Long[] categoryIds, Long[] authorIds, Pageable pageable) {
        return bookRepository.findByKeyword(keyword, pageable).map(bookMapper::toDto);
    }
}
