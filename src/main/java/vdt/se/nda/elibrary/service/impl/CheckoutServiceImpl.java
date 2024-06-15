package vdt.se.nda.elibrary.service.impl;

import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.domain.enumeration.BookCopyStatus;
import vdt.se.nda.elibrary.domain.enumeration.PatronStatus;
import vdt.se.nda.elibrary.repository.*;
import vdt.se.nda.elibrary.service.CheckoutService;
import vdt.se.nda.elibrary.service.JobSchedulerService;
import vdt.se.nda.elibrary.service.dto.CheckoutDTO;
import vdt.se.nda.elibrary.service.mapper.CheckoutMapper;

/**
 * Service Implementation for managing {@link Checkout}.
 */
@Service
@Transactional
public class CheckoutServiceImpl implements CheckoutService {

    private final Logger log = LoggerFactory.getLogger(CheckoutServiceImpl.class);

    private final CheckoutRepository checkoutRepository;

    private final HoldRepository holdRepository;

    private final BookCopyRepository bookCopyRepository;

    private final PatronAccountRepository patronAccountRepository;

    private final UserRepository userRepository;

    private final CheckoutMapper checkoutMapper;

    private final JobSchedulerService jobSchedulerService;

    public CheckoutServiceImpl(
        CheckoutRepository checkoutRepository,
        HoldRepository holdRepository,
        BookCopyRepository bookCopyRepository,
        PatronAccountRepository patronAccountRepository,
        UserRepository userRepository,
        CheckoutMapper checkoutMapper,
        JobSchedulerService jobSchedulerService
    ) {
        this.checkoutRepository = checkoutRepository;
        this.holdRepository = holdRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.patronAccountRepository = patronAccountRepository;
        this.userRepository = userRepository;
        this.checkoutMapper = checkoutMapper;
        this.jobSchedulerService = jobSchedulerService;

        checkoutRepository.findByIsReturnedAndEndTimeAfter(false, Instant.now()).forEach(this::scheduleJobOnExpiration);
    }

    @Override
    public CheckoutDTO save(CheckoutDTO checkoutDTO) {
        log.debug("Request to save Checkout : {}", checkoutDTO);
        Checkout checkout = checkoutMapper.toEntity(checkoutDTO);
        populateRelationships(checkout);
        checkout = checkoutRepository.save(checkout);
        updateHoldStatus(checkout);
        updateCopyStatus(checkout);
        return checkoutMapper.toDto(checkout);
    }

    @Override
    public CheckoutDTO update(CheckoutDTO checkoutDTO) {
        log.debug("Request to update Checkout : {}", checkoutDTO);
        Checkout checkout = checkoutMapper.toEntity(checkoutDTO);
        populateRelationships(checkout);
        checkout = checkoutRepository.save(checkout);
        updateCopyStatus(checkout);
        return checkoutMapper.toDto(checkout);
    }

    private void populateRelationships(Checkout checkout) {
        if (checkout.getPatron().getId() != null) patronAccountRepository
            .findById(checkout.getPatron().getId())
            .ifPresent(checkout::setPatron);

        if (checkout.getCopy().getId() != null) bookCopyRepository.findById(checkout.getCopy().getId()).ifPresent(checkout::setCopy);
    }

    private void updateHoldStatus(Checkout checkout) {
        holdRepository
            .findByPatronIdAndCopyIdAndIsCheckedOutAndEndTimeAfter(
                checkout.getPatron().getId(),
                checkout.getCopy().getId(),
                false,
                Instant.now()
            )
            .ifPresent(hold -> {
                hold.setEndTime(checkout.getStartTime());
                hold.setIsCheckedOut(true);
                holdRepository.save(hold);
            });
    }

    private void updateCopyStatus(Checkout checkout) {
        if (!checkout.getIsReturned() && checkout.getEndTime().isAfter(Instant.now())) {
            checkout.getCopy().setStatus(BookCopyStatus.BORROWED);
            bookCopyRepository.save(checkout.getCopy());

            log.info("Scheduling job on expiration of checkout: {}", checkout);
            scheduleJobOnExpiration(checkout);
        }
    }

    @Override
    public Optional<CheckoutDTO> partialUpdate(CheckoutDTO checkoutDTO) {
        log.debug("Request to partially update Checkout : {}", checkoutDTO);

        return checkoutRepository
            .findById(checkoutDTO.getId())
            .map(existingCheckout -> {
                checkoutMapper.partialUpdate(existingCheckout, checkoutDTO);

                return existingCheckout;
            })
            .map(checkoutRepository::save)
            .map(checkoutMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CheckoutDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Checkouts");
        return checkoutRepository.findAll(pageable).map(checkoutMapper::toDto);
    }

    @Override
    public Page<CheckoutDTO> findByKeyword(String keyword, Pageable pageable) {
        log.debug("Request to find checkouts by keyword: {}", keyword);
        return checkoutRepository.findByKeyword(keyword.trim(), pageable).map(checkoutMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CheckoutDTO> findOne(Long id) {
        log.debug("Request to get Checkout : {}", id);
        return checkoutRepository.findById(id).map(checkoutMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Checkout : {}", id);
        checkoutRepository.deleteById(id);
    }

    private void scheduleJobOnExpiration(Checkout checkout) {
        jobSchedulerService.scheduleJob("checkout-expiration", checkout.getId(), checkout.getEndTime(), () -> handleExpiration(checkout));
    }

    public void handleExpiration(Checkout checkout) {
        log.debug("Checkout expired: " + checkout.getId());

        var patron = checkout.getPatron().status(PatronStatus.BLOCKED);
        patronAccountRepository.save(patron);

        var user = patron.getUser();
        user.setActivated(false);
        userRepository.save(user);
        // TODO: send notification mail
    }
}
