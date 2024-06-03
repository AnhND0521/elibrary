package vdt.se.nda.elibrary.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HoldMapperTest {

    private HoldMapper holdMapper;

    @BeforeEach
    public void setUp() {
        holdMapper = new HoldMapperImpl();
    }
}
