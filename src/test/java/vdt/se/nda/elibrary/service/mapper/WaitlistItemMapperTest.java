package vdt.se.nda.elibrary.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class WaitlistItemMapperTest {

    private WaitlistItemMapper waitlistItemMapper;

    @BeforeEach
    public void setUp() {
        waitlistItemMapper = new WaitlistItemMapperImpl();
    }
}
