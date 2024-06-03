package vdt.se.nda.elibrary.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.Notification;

/**
 * Spring Data JPA repository for the Notification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {}
