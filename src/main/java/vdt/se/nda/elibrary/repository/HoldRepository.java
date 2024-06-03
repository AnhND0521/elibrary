package vdt.se.nda.elibrary.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Hold;

/**
 * Spring Data JPA repository for the Hold entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HoldRepository extends JpaRepository<Hold, Long> {}
