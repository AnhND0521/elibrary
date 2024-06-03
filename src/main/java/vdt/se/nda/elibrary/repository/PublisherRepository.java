package vdt.se.nda.elibrary.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Publisher;

/**
 * Spring Data JPA repository for the Publisher entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {}
