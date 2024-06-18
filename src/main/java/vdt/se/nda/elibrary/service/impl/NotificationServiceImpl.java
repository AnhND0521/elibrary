package vdt.se.nda.elibrary.service.impl;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.Book;
import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.domain.Notification;
import vdt.se.nda.elibrary.domain.enumeration.BookCopyStatus;
import vdt.se.nda.elibrary.repository.BookCopyRepository;
import vdt.se.nda.elibrary.repository.NotificationRepository;
import vdt.se.nda.elibrary.repository.WaitlistItemRepository;
import vdt.se.nda.elibrary.service.MailService;
import vdt.se.nda.elibrary.service.NotificationService;
import vdt.se.nda.elibrary.service.dto.NotificationDTO;
import vdt.se.nda.elibrary.service.mapper.NotificationMapper;

/**
 * Service Implementation for managing {@link Notification}.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;

    private final NotificationMapper notificationMapper;

    private final WaitlistItemRepository waitlistItemRepository;

    private final BookCopyRepository bookCopyRepository;

    private final MailService mailService;

    @Override
    public NotificationDTO save(NotificationDTO notificationDTO) {
        log.debug("Request to save Notification : {}", notificationDTO);
        Notification notification = notificationMapper.toEntity(notificationDTO);
        notification = notificationRepository.save(notification);
        return notificationMapper.toDto(notification);
    }

    @Override
    public NotificationDTO update(NotificationDTO notificationDTO) {
        log.debug("Request to update Notification : {}", notificationDTO);
        Notification notification = notificationMapper.toEntity(notificationDTO);
        notification = notificationRepository.save(notification);
        return notificationMapper.toDto(notification);
    }

    @Override
    public Optional<NotificationDTO> partialUpdate(NotificationDTO notificationDTO) {
        log.debug("Request to partially update Notification : {}", notificationDTO);

        return notificationRepository
            .findById(notificationDTO.getId())
            .map(existingNotification -> {
                notificationMapper.partialUpdate(existingNotification, notificationDTO);

                return existingNotification;
            })
            .map(notificationRepository::save)
            .map(notificationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Notifications");
        return notificationRepository.findAll(pageable).map(notificationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<NotificationDTO> findOne(Long id) {
        log.debug("Request to get Notification : {}", id);
        return notificationRepository.findById(id).map(notificationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Notification : {}", id);
        notificationRepository.deleteById(id);
    }

    @Override
    public void notifyBookAvailable(Book book) {
        if (bookCopyRepository.countByBookIdAndStatus(book.getId(), BookCopyStatus.AVAILABLE) == 1) {
            waitlistItemRepository.findByBookId(book.getId()).forEach(mailService::sendBookAvailableMail);
        }
    }

    @Override
    public void remindToReturnBook(Checkout checkout, int daysLeft) {
        mailService.sendBookReturnReminderMail(checkout, daysLeft);
    }
}
