package vdt.se.nda.elibrary.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Author;

/**
 * Spring Data JPA repository for the Author entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {}
