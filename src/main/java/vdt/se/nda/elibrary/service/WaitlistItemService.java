package vdt.se.nda.elibrary.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vdt.se.nda.elibrary.service.dto.WaitlistItemDTO;

/**
 * Service Interface for managing {@link vdt.se.nda.elibrary.domain.WaitlistItem}.
 */
public interface WaitlistItemService {
    /**
     * Save a waitlistItem.
     *
     * @param waitlistItemDTO the entity to save.
     * @return the persisted entity.
     */
    WaitlistItemDTO save(WaitlistItemDTO waitlistItemDTO);

    /**
     * Updates a waitlistItem.
     *
     * @param waitlistItemDTO the entity to update.
     * @return the persisted entity.
     */
    WaitlistItemDTO update(WaitlistItemDTO waitlistItemDTO);

    /**
     * Partially updates a waitlistItem.
     *
     * @param waitlistItemDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<WaitlistItemDTO> partialUpdate(WaitlistItemDTO waitlistItemDTO);

    /**
     * Get all the waitlistItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<WaitlistItemDTO> findAll(Pageable pageable);

    /**
     * Get all the waitlistItems with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<WaitlistItemDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" waitlistItem.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<WaitlistItemDTO> findOne(Long id);

    /**
     * Delete the "id" waitlistItem.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get all the waitlistItems of the current user.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<WaitlistItemDTO> findByCurrentUser(Pageable pageable);

    /**
     * Get the waitlistItem of some book of the current user.
     *
     * @return the entity.
     */
    Optional<WaitlistItemDTO> findByCurrentUserByBook(Long bookId);
}
