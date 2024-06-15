package vdt.se.nda.elibrary.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vdt.se.nda.elibrary.service.dto.CheckoutDTO;

/**
 * Service Interface for managing {@link vdt.se.nda.elibrary.domain.Checkout}.
 */
public interface CheckoutService {
    /**
     * Save a checkout.
     *
     * @param checkoutDTO the entity to save.
     * @return the persisted entity.
     */
    CheckoutDTO save(CheckoutDTO checkoutDTO);

    /**
     * Updates a checkout.
     *
     * @param checkoutDTO the entity to update.
     * @return the persisted entity.
     */
    CheckoutDTO update(CheckoutDTO checkoutDTO);

    /**
     * Partially updates a checkout.
     *
     * @param checkoutDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CheckoutDTO> partialUpdate(CheckoutDTO checkoutDTO);

    /**
     * Get all the checkouts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CheckoutDTO> findAll(Pageable pageable);

    /**
     * Get all the checkouts of the current user.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CheckoutDTO> findByCurrentUser(Pageable pageable);

    /**
     * Get checkouts by keyword matching checkout id, patron id or book copy id.
     *
     * @param keyword  the keyword.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CheckoutDTO> findByKeyword(String keyword, Pageable pageable);

    /**
     * Get the "id" checkout.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CheckoutDTO> findOne(Long id);

    /**
     * Delete the "id" checkout.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
