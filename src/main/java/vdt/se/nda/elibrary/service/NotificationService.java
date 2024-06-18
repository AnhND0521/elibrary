package vdt.se.nda.elibrary.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vdt.se.nda.elibrary.domain.Book;
import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.service.dto.NotificationDTO;

/**
 * Service Interface for managing {@link vdt.se.nda.elibrary.domain.Notification}.
 */
public interface NotificationService {
    /**
     * Save a notification.
     *
     * @param notificationDTO the entity to save.
     * @return the persisted entity.
     */
    NotificationDTO save(NotificationDTO notificationDTO);

    /**
     * Updates a notification.
     *
     * @param notificationDTO the entity to update.
     * @return the persisted entity.
     */
    NotificationDTO update(NotificationDTO notificationDTO);

    /**
     * Partially updates a notification.
     *
     * @param notificationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<NotificationDTO> partialUpdate(NotificationDTO notificationDTO);

    /**
     * Get all the notifications.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<NotificationDTO> findAll(Pageable pageable);

    /**
     * Get the "id" notification.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<NotificationDTO> findOne(Long id);

    /**
     * Delete the "id" notification.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * When a book becomes available, notify users who has that book on waitlist.
     *
     * @param book the book to notify users of its availability.
     */
    void notifyBookAvailable(Book book);

    /**
     * Remind user to return a book which has been checked out.
     *
     * @param checkout the checkout that has the user and the book information.
     * @param daysLeft days before the due time to remind.
     */
    void remindToReturnBook(Checkout checkout, int daysLeft);

    /**
     * Notify user that due time to return the book has passed.
     *
     * @param checkout the checkout that has the user and the book information.
     */
    void notifyOverdueBookReturn(Checkout checkout);
}
