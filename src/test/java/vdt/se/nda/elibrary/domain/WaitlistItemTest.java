package vdt.se.nda.elibrary.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import vdt.se.nda.elibrary.web.rest.TestUtil;

class WaitlistItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WaitlistItem.class);
        WaitlistItem waitlistItem1 = new WaitlistItem();
        waitlistItem1.setId(1L);
        WaitlistItem waitlistItem2 = new WaitlistItem();
        waitlistItem2.setId(waitlistItem1.getId());
        assertThat(waitlistItem1).isEqualTo(waitlistItem2);
        waitlistItem2.setId(2L);
        assertThat(waitlistItem1).isNotEqualTo(waitlistItem2);
        waitlistItem1.setId(null);
        assertThat(waitlistItem1).isNotEqualTo(waitlistItem2);
    }
}
