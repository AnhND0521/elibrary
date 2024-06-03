package vdt.se.nda.elibrary.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import vdt.se.nda.elibrary.web.rest.TestUtil;

class HoldTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Hold.class);
        Hold hold1 = new Hold();
        hold1.setId(1L);
        Hold hold2 = new Hold();
        hold2.setId(hold1.getId());
        assertThat(hold1).isEqualTo(hold2);
        hold2.setId(2L);
        assertThat(hold1).isNotEqualTo(hold2);
        hold1.setId(null);
        assertThat(hold1).isNotEqualTo(hold2);
    }
}
