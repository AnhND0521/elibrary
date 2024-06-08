package vdt.se.nda.elibrary.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vdt.se.nda.elibrary.domain.User;
import vdt.se.nda.elibrary.service.dto.PatronAccountDTO;

/**
 * Service Interface for managing {@link vdt.se.nda.elibrary.domain.PatronAccount}.
 */
public interface PatronAccountService {
    /**
     * Save a patronAccount.
     *
     * @param patronAccountDTO the entity to save.
     * @return the persisted entity.
     */
    PatronAccountDTO save(PatronAccountDTO patronAccountDTO);

    /**
     * Updates a patronAccount.
     *
     * @param patronAccountDTO the entity to update.
     * @return the persisted entity.
     */
    PatronAccountDTO update(PatronAccountDTO patronAccountDTO);

    /**
     * Partially updates a patronAccount.
     *
     * @param patronAccountDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PatronAccountDTO> partialUpdate(PatronAccountDTO patronAccountDTO);

    /**
     * Get all the patronAccounts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PatronAccountDTO> findAll(Pageable pageable);

    /**
     * Get all the patronAccounts with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PatronAccountDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" patronAccount.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PatronAccountDTO> findOne(String id);

    /**
     * Delete the "id" patronAccount.
     *
     * @param id the id of the entity.
     */
    void delete(String id);

    /**
     * Create a patronAccount from a user entity
     *
     * @param user the user for which to create patronAccount
     * @return the patronAccount created
     */
    PatronAccountDTO createFromUser(User user);
}
