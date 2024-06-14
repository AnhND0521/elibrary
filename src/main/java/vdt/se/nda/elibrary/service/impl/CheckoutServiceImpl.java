package vdt.se.nda.elibrary.service.impl;

import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.domain.enumeration.BookCopyStatus;
import vdt.se.nda.elibrary.repository.BookCopyRepository;
import vdt.se.nda.elibrary.repository.CheckoutRepository;
import vdt.se.nda.elibrary.repository.HoldRepository;
import vdt.se.nda.elibrary.repository.PatronAccountRepository;
import vdt.se.nda.elibrary.service.CheckoutService;
import vdt.se.nda.elibrary.service.dto.CheckoutDTO;
import vdt.se.nda.elibrary.service.mapper.CheckoutMapper;

/**
 * Service Implementation for managing {@link Checkout}.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final Logger log = LoggerFactory.getLogger(CheckoutServiceImpl.class);

    private final CheckoutRepository checkoutRepository;

    private final HoldRepository holdRepository;

    private final BookCopyRepository bookCopyRepository;

    private final PatronAccountRepository patronAccountRepository;

    private final CheckoutMapper checkoutMapper;

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
            //            jobSchedulerService.scheduleHandleHoldExpirationJob(hold);
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
}
