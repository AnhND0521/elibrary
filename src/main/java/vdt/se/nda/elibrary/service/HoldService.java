package vdt.se.nda.elibrary.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.service.dto.HoldDTO;

/**
 * Service Interface for managing {@link vdt.se.nda.elibrary.domain.Hold}.
 */
public interface HoldService {
    /**
     * Save a hold.
     *
     * @param holdDTO the entity to save.
     * @return the persisted entity.
     */
    HoldDTO save(HoldDTO holdDTO);

    /**
     * Updates a hold.
     *
     * @param holdDTO the entity to update.
     * @return the persisted entity.
     */
    HoldDTO update(HoldDTO holdDTO);

    /**
     * Partially updates a hold.
     *
     * @param holdDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<HoldDTO> partialUpdate(HoldDTO holdDTO);

    /**
     * Get all the holds.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HoldDTO> findAll(Pageable pageable);

    /**
     * Get all current holds of the current user.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HoldDTO> findCurrent(Pageable pageable);

    /**
     * Get holds by keyword matching hold id, patron id or book copy id.
     *
     * @param keyword the keyword.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HoldDTO> findByKeyword(String keyword, Pageable pageable);

    /**
     * Get the "id" hold.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HoldDTO> findOne(Long id);

    /**
     * Delete the "id" hold.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
