package vdt.se.nda.elibrary.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query(
        "select hold from Hold hold " +
        "left join hold.patron patron " +
        "left join hold.copy copy " +
        "where cast(hold.id as text) like concat('%', ?1, '%') " +
        "or cast(patron.id as text) like concat('%', ?1, '%') " +
        "or cast(copy.id as text) like concat('%', ?1, '%') "
    )
    Page<Hold> findByKeyword(String keyword, Pageable pageable);

    @Query(
        "select hold from Hold hold " +
        "left join hold.patron patron " +
        "left join hold.copy copy " +
        "where patron.id = ?1 and copy.id = ?2 " +
        "and hold.isCheckedOut = ?3 and hold.endTime > ?4"
    )
    Optional<Hold> findByPatronIdAndCopyIdAndIsCheckedOutAndEndTimeAfter(
        String patronId,
        Long copyId,
        boolean isCheckedOut,
        Instant instant
    );
}
