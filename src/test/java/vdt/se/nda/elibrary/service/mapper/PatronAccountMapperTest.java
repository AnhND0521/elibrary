package vdt.se.nda.elibrary.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PatronAccountMapperTest {

    private PatronAccountMapper patronAccountMapper;

    @BeforeEach
    public void setUp() {
        patronAccountMapper = new PatronAccountMapperImpl();
    }
}
