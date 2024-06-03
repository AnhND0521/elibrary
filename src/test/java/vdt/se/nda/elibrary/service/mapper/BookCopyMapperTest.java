package vdt.se.nda.elibrary.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BookCopyMapperTest {

    private BookCopyMapper bookCopyMapper;

    @BeforeEach
    public void setUp() {
        bookCopyMapper = new BookCopyMapperImpl();
    }
}
