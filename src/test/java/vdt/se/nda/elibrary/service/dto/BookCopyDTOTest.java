package vdt.se.nda.elibrary.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import vdt.se.nda.elibrary.web.rest.TestUtil;

class BookCopyDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookCopyDTO.class);
        BookCopyDTO bookCopyDTO1 = new BookCopyDTO();
        bookCopyDTO1.setId(1L);
        BookCopyDTO bookCopyDTO2 = new BookCopyDTO();
        assertThat(bookCopyDTO1).isNotEqualTo(bookCopyDTO2);
        bookCopyDTO2.setId(bookCopyDTO1.getId());
        assertThat(bookCopyDTO1).isEqualTo(bookCopyDTO2);
        bookCopyDTO2.setId(2L);
        assertThat(bookCopyDTO1).isNotEqualTo(bookCopyDTO2);
        bookCopyDTO1.setId(null);
        assertThat(bookCopyDTO1).isNotEqualTo(bookCopyDTO2);
    }
}
