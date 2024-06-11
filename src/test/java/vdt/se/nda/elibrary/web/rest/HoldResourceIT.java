package vdt.se.nda.elibrary.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.IntegrationTest;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.repository.HoldRepository;
import vdt.se.nda.elibrary.service.dto.HoldDTO;
import vdt.se.nda.elibrary.service.mapper.HoldMapper;

/**
 * Integration tests for the {@link HoldResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HoldResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IS_CHECKED_OUT = false;
    private static final Boolean UPDATED_IS_CHECKED_OUT = true;

    private static final String ENTITY_API_URL = "/api/holds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HoldRepository holdRepository;

    @Autowired
    private HoldMapper holdMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHoldMockMvc;

    private Hold hold;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hold createEntity(EntityManager em) {
        Hold hold = new Hold().startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME).isCheckedOut(DEFAULT_IS_CHECKED_OUT);
        return hold;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hold createUpdatedEntity(EntityManager em) {
        Hold hold = new Hold().startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).isCheckedOut(UPDATED_IS_CHECKED_OUT);
        return hold;
    }

    @BeforeEach
    public void initTest() {
        hold = createEntity(em);
    }

    @Test
    @Transactional
    void createHold() throws Exception {
        int databaseSizeBeforeCreate = holdRepository.findAll().size();
        // Create the Hold
        HoldDTO holdDTO = holdMapper.toDto(hold);
        restHoldMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(holdDTO)))
            .andExpect(status().isCreated());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeCreate + 1);
        Hold testHold = holdList.get(holdList.size() - 1);
        assertThat(testHold.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testHold.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testHold.getIsCheckedOut()).isEqualTo(DEFAULT_IS_CHECKED_OUT);
    }

    @Test
    @Transactional
    void createHoldWithExistingId() throws Exception {
        // Create the Hold with an existing ID
        hold.setId(1L);
        HoldDTO holdDTO = holdMapper.toDto(hold);

        int databaseSizeBeforeCreate = holdRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHoldMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(holdDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHolds() throws Exception {
        // Initialize the database
        holdRepository.saveAndFlush(hold);

        // Get all the holdList
        restHoldMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(hold.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].isCheckedOut").value(hasItem(DEFAULT_IS_CHECKED_OUT.booleanValue())));
    }

    @Test
    @Transactional
    void getHold() throws Exception {
        // Initialize the database
        holdRepository.saveAndFlush(hold);

        // Get the hold
        restHoldMockMvc
            .perform(get(ENTITY_API_URL_ID, hold.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(hold.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.isCheckedOut").value(DEFAULT_IS_CHECKED_OUT.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingHold() throws Exception {
        // Get the hold
        restHoldMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHold() throws Exception {
        // Initialize the database
        holdRepository.saveAndFlush(hold);

        int databaseSizeBeforeUpdate = holdRepository.findAll().size();

        // Update the hold
        Hold updatedHold = holdRepository.findById(hold.getId()).get();
        // Disconnect from session so that the updates on updatedHold are not directly saved in db
        em.detach(updatedHold);
        updatedHold.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).isCheckedOut(UPDATED_IS_CHECKED_OUT);
        HoldDTO holdDTO = holdMapper.toDto(updatedHold);

        restHoldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, holdDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(holdDTO))
            )
            .andExpect(status().isOk());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
        Hold testHold = holdList.get(holdList.size() - 1);
        assertThat(testHold.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testHold.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testHold.getIsCheckedOut()).isEqualTo(UPDATED_IS_CHECKED_OUT);
    }

    @Test
    @Transactional
    void putNonExistingHold() throws Exception {
        int databaseSizeBeforeUpdate = holdRepository.findAll().size();
        hold.setId(count.incrementAndGet());

        // Create the Hold
        HoldDTO holdDTO = holdMapper.toDto(hold);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHoldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, holdDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(holdDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHold() throws Exception {
        int databaseSizeBeforeUpdate = holdRepository.findAll().size();
        hold.setId(count.incrementAndGet());

        // Create the Hold
        HoldDTO holdDTO = holdMapper.toDto(hold);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHoldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(holdDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHold() throws Exception {
        int databaseSizeBeforeUpdate = holdRepository.findAll().size();
        hold.setId(count.incrementAndGet());

        // Create the Hold
        HoldDTO holdDTO = holdMapper.toDto(hold);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHoldMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(holdDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHoldWithPatch() throws Exception {
        // Initialize the database
        holdRepository.saveAndFlush(hold);

        int databaseSizeBeforeUpdate = holdRepository.findAll().size();

        // Update the hold using partial update
        Hold partialUpdatedHold = new Hold();
        partialUpdatedHold.setId(hold.getId());

        partialUpdatedHold.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).isCheckedOut(UPDATED_IS_CHECKED_OUT);

        restHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHold.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHold))
            )
            .andExpect(status().isOk());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
        Hold testHold = holdList.get(holdList.size() - 1);
        assertThat(testHold.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testHold.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testHold.getIsCheckedOut()).isEqualTo(UPDATED_IS_CHECKED_OUT);
    }

    @Test
    @Transactional
    void fullUpdateHoldWithPatch() throws Exception {
        // Initialize the database
        holdRepository.saveAndFlush(hold);

        int databaseSizeBeforeUpdate = holdRepository.findAll().size();

        // Update the hold using partial update
        Hold partialUpdatedHold = new Hold();
        partialUpdatedHold.setId(hold.getId());

        partialUpdatedHold.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).isCheckedOut(UPDATED_IS_CHECKED_OUT);

        restHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHold.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHold))
            )
            .andExpect(status().isOk());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
        Hold testHold = holdList.get(holdList.size() - 1);
        assertThat(testHold.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testHold.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testHold.getIsCheckedOut()).isEqualTo(UPDATED_IS_CHECKED_OUT);
    }

    @Test
    @Transactional
    void patchNonExistingHold() throws Exception {
        int databaseSizeBeforeUpdate = holdRepository.findAll().size();
        hold.setId(count.incrementAndGet());

        // Create the Hold
        HoldDTO holdDTO = holdMapper.toDto(hold);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, holdDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(holdDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHold() throws Exception {
        int databaseSizeBeforeUpdate = holdRepository.findAll().size();
        hold.setId(count.incrementAndGet());

        // Create the Hold
        HoldDTO holdDTO = holdMapper.toDto(hold);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHoldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(holdDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHold() throws Exception {
        int databaseSizeBeforeUpdate = holdRepository.findAll().size();
        hold.setId(count.incrementAndGet());

        // Create the Hold
        HoldDTO holdDTO = holdMapper.toDto(hold);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHoldMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(holdDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hold in the database
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHold() throws Exception {
        // Initialize the database
        holdRepository.saveAndFlush(hold);

        int databaseSizeBeforeDelete = holdRepository.findAll().size();

        // Delete the hold
        restHoldMockMvc
            .perform(delete(ENTITY_API_URL_ID, hold.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Hold> holdList = holdRepository.findAll();
        assertThat(holdList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
