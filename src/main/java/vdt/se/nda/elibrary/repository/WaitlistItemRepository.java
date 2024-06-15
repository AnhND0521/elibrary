package vdt.se.nda.elibrary.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.WaitlistItem;

/**
 * Spring Data JPA repository for the WaitlistItem entity.
 */
@Repository
public interface WaitlistItemRepository extends JpaRepository<WaitlistItem, Long> {
    default Optional<WaitlistItem> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<WaitlistItem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<WaitlistItem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct waitlistItem from WaitlistItem waitlistItem left join fetch waitlistItem.book",
        countQuery = "select count(distinct waitlistItem) from WaitlistItem waitlistItem"
    )
    Page<WaitlistItem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct waitlistItem from WaitlistItem waitlistItem left join fetch waitlistItem.book")
    List<WaitlistItem> findAllWithToOneRelationships();

    @Query("select waitlistItem from WaitlistItem waitlistItem left join fetch waitlistItem.book where waitlistItem.id =:id")
    Optional<WaitlistItem> findOneWithToOneRelationships(@Param("id") Long id);

    Optional<WaitlistItem> findByPatronCardNumberAndBookId(String patronCardNumber, Long bookId);

    Page<WaitlistItem> findByPatronUserLogin(String login, Pageable pageable);
}
