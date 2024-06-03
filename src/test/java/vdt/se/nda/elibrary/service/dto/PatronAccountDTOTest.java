package vdt.se.nda.elibrary.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import vdt.se.nda.elibrary.web.rest.TestUtil;

class PatronAccountDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PatronAccountDTO.class);
        PatronAccountDTO patronAccountDTO1 = new PatronAccountDTO();
        patronAccountDTO1.setCardNumber("id1");
        PatronAccountDTO patronAccountDTO2 = new PatronAccountDTO();
        assertThat(patronAccountDTO1).isNotEqualTo(patronAccountDTO2);
        patronAccountDTO2.setCardNumber(patronAccountDTO1.getCardNumber());
        assertThat(patronAccountDTO1).isEqualTo(patronAccountDTO2);
        patronAccountDTO2.setCardNumber("id2");
        assertThat(patronAccountDTO1).isNotEqualTo(patronAccountDTO2);
        patronAccountDTO1.setCardNumber(null);
        assertThat(patronAccountDTO1).isNotEqualTo(patronAccountDTO2);
    }
}
