package vdt.se.nda.elibrary.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.IntegrationTest;
import vdt.se.nda.elibrary.domain.WaitlistItem;
import vdt.se.nda.elibrary.repository.WaitlistItemRepository;
import vdt.se.nda.elibrary.service.WaitlistItemService;
import vdt.se.nda.elibrary.service.dto.WaitlistItemDTO;
import vdt.se.nda.elibrary.service.mapper.WaitlistItemMapper;

/**
 * Integration tests for the {@link WaitlistItemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class WaitlistItemResourceIT {

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/waitlist-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WaitlistItemRepository waitlistItemRepository;

    @Mock
    private WaitlistItemRepository waitlistItemRepositoryMock;

    @Autowired
    private WaitlistItemMapper waitlistItemMapper;

    @Mock
    private WaitlistItemService waitlistItemServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWaitlistItemMockMvc;

    private WaitlistItem waitlistItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WaitlistItem createEntity(EntityManager em) {
        WaitlistItem waitlistItem = new WaitlistItem().timestamp(DEFAULT_TIMESTAMP);
        return waitlistItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WaitlistItem createUpdatedEntity(EntityManager em) {
        WaitlistItem waitlistItem = new WaitlistItem().timestamp(UPDATED_TIMESTAMP);
        return waitlistItem;
    }

    @BeforeEach
    public void initTest() {
        waitlistItem = createEntity(em);
    }

    @Test
    @Transactional
    void createWaitlistItem() throws Exception {
        int databaseSizeBeforeCreate = waitlistItemRepository.findAll().size();
        // Create the WaitlistItem
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);
        restWaitlistItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isCreated());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeCreate + 1);
        WaitlistItem testWaitlistItem = waitlistItemList.get(waitlistItemList.size() - 1);
        assertThat(testWaitlistItem.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void createWaitlistItemWithExistingId() throws Exception {
        // Create the WaitlistItem with an existing ID
        waitlistItem.setId(1L);
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);

        int databaseSizeBeforeCreate = waitlistItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWaitlistItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllWaitlistItems() throws Exception {
        // Initialize the database
        waitlistItemRepository.saveAndFlush(waitlistItem);

        // Get all the waitlistItemList
        restWaitlistItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(waitlistItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWaitlistItemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(waitlistItemServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restWaitlistItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(waitlistItemServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWaitlistItemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(waitlistItemServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restWaitlistItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(waitlistItemRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getWaitlistItem() throws Exception {
        // Initialize the database
        waitlistItemRepository.saveAndFlush(waitlistItem);

        // Get the waitlistItem
        restWaitlistItemMockMvc
            .perform(get(ENTITY_API_URL_ID, waitlistItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(waitlistItem.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWaitlistItem() throws Exception {
        // Get the waitlistItem
        restWaitlistItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWaitlistItem() throws Exception {
        // Initialize the database
        waitlistItemRepository.saveAndFlush(waitlistItem);

        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();

        // Update the waitlistItem
        WaitlistItem updatedWaitlistItem = waitlistItemRepository.findById(waitlistItem.getId()).get();
        // Disconnect from session so that the updates on updatedWaitlistItem are not directly saved in db
        em.detach(updatedWaitlistItem);
        updatedWaitlistItem.timestamp(UPDATED_TIMESTAMP);
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(updatedWaitlistItem);

        restWaitlistItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, waitlistItemDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isOk());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
        WaitlistItem testWaitlistItem = waitlistItemList.get(waitlistItemList.size() - 1);
        assertThat(testWaitlistItem.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingWaitlistItem() throws Exception {
        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();
        waitlistItem.setId(count.incrementAndGet());

        // Create the WaitlistItem
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWaitlistItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, waitlistItemDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWaitlistItem() throws Exception {
        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();
        waitlistItem.setId(count.incrementAndGet());

        // Create the WaitlistItem
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWaitlistItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWaitlistItem() throws Exception {
        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();
        waitlistItem.setId(count.incrementAndGet());

        // Create the WaitlistItem
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWaitlistItemMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWaitlistItemWithPatch() throws Exception {
        // Initialize the database
        waitlistItemRepository.saveAndFlush(waitlistItem);

        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();

        // Update the waitlistItem using partial update
        WaitlistItem partialUpdatedWaitlistItem = new WaitlistItem();
        partialUpdatedWaitlistItem.setId(waitlistItem.getId());

        restWaitlistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWaitlistItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWaitlistItem))
            )
            .andExpect(status().isOk());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
        WaitlistItem testWaitlistItem = waitlistItemList.get(waitlistItemList.size() - 1);
        assertThat(testWaitlistItem.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdateWaitlistItemWithPatch() throws Exception {
        // Initialize the database
        waitlistItemRepository.saveAndFlush(waitlistItem);

        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();

        // Update the waitlistItem using partial update
        WaitlistItem partialUpdatedWaitlistItem = new WaitlistItem();
        partialUpdatedWaitlistItem.setId(waitlistItem.getId());

        partialUpdatedWaitlistItem.timestamp(UPDATED_TIMESTAMP);

        restWaitlistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWaitlistItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWaitlistItem))
            )
            .andExpect(status().isOk());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
        WaitlistItem testWaitlistItem = waitlistItemList.get(waitlistItemList.size() - 1);
        assertThat(testWaitlistItem.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingWaitlistItem() throws Exception {
        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();
        waitlistItem.setId(count.incrementAndGet());

        // Create the WaitlistItem
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWaitlistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, waitlistItemDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWaitlistItem() throws Exception {
        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();
        waitlistItem.setId(count.incrementAndGet());

        // Create the WaitlistItem
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWaitlistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWaitlistItem() throws Exception {
        int databaseSizeBeforeUpdate = waitlistItemRepository.findAll().size();
        waitlistItem.setId(count.incrementAndGet());

        // Create the WaitlistItem
        WaitlistItemDTO waitlistItemDTO = waitlistItemMapper.toDto(waitlistItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWaitlistItemMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(waitlistItemDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WaitlistItem in the database
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWaitlistItem() throws Exception {
        // Initialize the database
        waitlistItemRepository.saveAndFlush(waitlistItem);

        int databaseSizeBeforeDelete = waitlistItemRepository.findAll().size();

        // Delete the waitlistItem
        restWaitlistItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, waitlistItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WaitlistItem> waitlistItemList = waitlistItemRepository.findAll();
        assertThat(waitlistItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
