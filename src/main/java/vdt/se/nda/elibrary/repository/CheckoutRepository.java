package vdt.se.nda.elibrary.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Checkout;

/**
 * Spring Data JPA repository for the Checkout entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {}
