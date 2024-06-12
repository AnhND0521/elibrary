package vdt.se.nda.elibrary.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Hold;

/**
 * Spring Data JPA repository for the Hold entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HoldRepository extends JpaRepository<Hold, Long> {
    @Query("select hold from Hold hold where hold.isCheckedOut = ?1 and hold.endTime > ?2")
    List<Hold> findByIsCheckedOutAndEndTimeAfter(boolean isCheckedOut, Instant instant);
}
