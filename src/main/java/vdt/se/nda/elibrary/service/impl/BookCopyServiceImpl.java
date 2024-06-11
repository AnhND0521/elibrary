package vdt.se.nda.elibrary.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.BookCopy;
import vdt.se.nda.elibrary.repository.BookCopyRepository;
import vdt.se.nda.elibrary.service.BookCopyService;
import vdt.se.nda.elibrary.service.dto.BookCopyDTO;
import vdt.se.nda.elibrary.service.mapper.BookCopyMapper;

/**
 * Service Implementation for managing {@link BookCopy}.
 */
@Service
@Transactional
public class BookCopyServiceImpl implements BookCopyService {

    private final Logger log = LoggerFactory.getLogger(BookCopyServiceImpl.class);

    private final BookCopyRepository bookCopyRepository;

    private final BookCopyMapper bookCopyMapper;

    public BookCopyServiceImpl(BookCopyRepository bookCopyRepository, BookCopyMapper bookCopyMapper) {
        this.bookCopyRepository = bookCopyRepository;
        this.bookCopyMapper = bookCopyMapper;
    }

    @Override
    public BookCopyDTO save(BookCopyDTO bookCopyDTO) {
        log.debug("Request to save BookCopy : {}", bookCopyDTO);
        BookCopy bookCopy = bookCopyMapper.toEntity(bookCopyDTO);
        bookCopy = bookCopyRepository.save(bookCopy);
        return bookCopyMapper.toDto(bookCopy);
    }

    @Override
    public BookCopyDTO update(BookCopyDTO bookCopyDTO) {
        log.debug("Request to update BookCopy : {}", bookCopyDTO);
        BookCopy bookCopy = bookCopyMapper.toEntity(bookCopyDTO);
        bookCopy = bookCopyRepository.save(bookCopy);
        return bookCopyMapper.toDto(bookCopy);
    }

    @Override
    public Optional<BookCopyDTO> partialUpdate(BookCopyDTO bookCopyDTO) {
        log.debug("Request to partially update BookCopy : {}", bookCopyDTO);

        return bookCopyRepository
            .findById(bookCopyDTO.getId())
            .map(existingBookCopy -> {
                bookCopyMapper.partialUpdate(existingBookCopy, bookCopyDTO);

                return existingBookCopy;
            })
            .map(bookCopyRepository::save)
            .map(bookCopyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookCopyDTO> findAll(Pageable pageable) {
        log.debug("Request to get all BookCopies");
        return bookCopyRepository.findAll(pageable).map(bookCopyMapper::toDto);
    }

    public Page<BookCopyDTO> findAllWithEagerRelationships(Pageable pageable) {
        return bookCopyRepository.findAllWithEagerRelationships(pageable).map(bookCopyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BookCopyDTO> findOne(Long id) {
        log.debug("Request to get BookCopy : {}", id);
        return bookCopyRepository.findOneWithEagerRelationships(id).map(bookCopyMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete BookCopy : {}", id);
        bookCopyRepository.deleteById(id);
    }

    @Override
    public List<BookCopyDTO> findByBook(Long bookId) {
        log.debug("Request to get BookCopies of Book : {}", bookId);
        return bookCopyRepository.findByBookId(bookId).stream().map(bookCopyMapper::toDto).collect(Collectors.toList());
    }
}
