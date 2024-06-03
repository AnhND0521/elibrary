package vdt.se.nda.elibrary.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import vdt.se.nda.elibrary.web.rest.TestUtil;

class WaitlistItemDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(WaitlistItemDTO.class);
        WaitlistItemDTO waitlistItemDTO1 = new WaitlistItemDTO();
        waitlistItemDTO1.setId(1L);
        WaitlistItemDTO waitlistItemDTO2 = new WaitlistItemDTO();
        assertThat(waitlistItemDTO1).isNotEqualTo(waitlistItemDTO2);
        waitlistItemDTO2.setId(waitlistItemDTO1.getId());
        assertThat(waitlistItemDTO1).isEqualTo(waitlistItemDTO2);
        waitlistItemDTO2.setId(2L);
        assertThat(waitlistItemDTO1).isNotEqualTo(waitlistItemDTO2);
        waitlistItemDTO1.setId(null);
        assertThat(waitlistItemDTO1).isNotEqualTo(waitlistItemDTO2);
    }
}
