package vdt.se.nda.elibrary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vdt.se.nda.elibrary.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
