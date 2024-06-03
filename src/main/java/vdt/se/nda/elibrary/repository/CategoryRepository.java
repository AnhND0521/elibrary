package vdt.se.nda.elibrary.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Category;

/**
 * Spring Data JPA repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {}
