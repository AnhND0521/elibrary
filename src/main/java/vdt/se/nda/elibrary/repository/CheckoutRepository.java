package vdt.se.nda.elibrary.repository;

import com.carrotsearch.hppc.ByteArrayList;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Checkout;

/**
 * Spring Data JPA repository for the Checkout entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    @Query(
        "select checkout from Checkout checkout " +
        "left join checkout.patron patron " +
        "left join checkout.copy copy " +
        "where cast(checkout.id as text) like concat('%', ?1, '%') " +
        "or cast(patron.id as text) like concat('%', ?1, '%') " +
        "or cast(copy.id as text) like concat('%', ?1, '%') "
    )
    Page<Checkout> findByKeyword(String keyword, Pageable pageable);

    @Query("select checkout from Checkout checkout where checkout.isReturned = ?1 and checkout.endTime > ?2")
    List<Checkout> findByIsReturnedAndEndTimeAfter(boolean isReturned, Instant instant);
}
