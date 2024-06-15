package vdt.se.nda.elibrary.service.impl;

import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.BookCopy;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.domain.enumeration.BookCopyStatus;
import vdt.se.nda.elibrary.repository.BookCopyRepository;
import vdt.se.nda.elibrary.repository.HoldRepository;
import vdt.se.nda.elibrary.security.SecurityUtils;
import vdt.se.nda.elibrary.service.HoldService;
import vdt.se.nda.elibrary.service.JobSchedulerService;
import vdt.se.nda.elibrary.service.dto.HoldDTO;
import vdt.se.nda.elibrary.service.mapper.HoldMapper;

/**
 * Service Implementation for managing {@link Hold}.
 */
@Service
@Transactional
public class HoldServiceImpl implements HoldService {

    private final Logger log = LoggerFactory.getLogger(HoldServiceImpl.class);

    private final HoldRepository holdRepository;

    private final HoldMapper holdMapper;

    private final BookCopyRepository bookCopyRepository;

    private final JobSchedulerService jobSchedulerService;

    private static final String HOLD_EXPIRATION = "hold-expiration";

    public HoldServiceImpl(
        HoldRepository holdRepository,
        HoldMapper holdMapper,
        BookCopyRepository bookCopyRepository,
        JobSchedulerService jobSchedulerService
    ) {
        this.holdRepository = holdRepository;
        this.holdMapper = holdMapper;
        this.bookCopyRepository = bookCopyRepository;
        this.jobSchedulerService = jobSchedulerService;

        holdRepository.findByIsCheckedOutAndEndTimeAfter(false, Instant.now()).forEach(this::scheduleJobOnExpiration);
    }

    @Override
    public HoldDTO save(HoldDTO holdDTO) {
        log.debug("Request to save Hold : {}", holdDTO);
        Hold hold = holdMapper.toEntity(holdDTO);
        hold = holdRepository.save(hold);

        updateCopyStatus(hold);

        return holdMapper.toDto(hold);
    }

    @Override
    public HoldDTO update(HoldDTO holdDTO) {
        log.debug("Request to update Hold : {}", holdDTO);
        Hold hold = holdMapper.toEntity(holdDTO);
        hold = holdRepository.save(hold);

        updateCopyStatus(hold);

        return holdMapper.toDto(hold);
    }

    private void updateCopyStatus(Hold hold) {
        if (!hold.getIsCheckedOut() && hold.getEndTime().isAfter(Instant.now())) {
            hold.getCopy().setStatus(BookCopyStatus.ON_HOLD);
            bookCopyRepository.save(hold.getCopy());

            scheduleJobOnExpiration(hold);
        }
    }

    @Override
    public Optional<HoldDTO> partialUpdate(HoldDTO holdDTO) {
        log.debug("Request to partially update Hold : {}", holdDTO);

        return holdRepository
            .findById(holdDTO.getId())
            .map(existingHold -> {
                holdMapper.partialUpdate(existingHold, holdDTO);

                return existingHold;
            })
            .map(holdRepository::save)
            .map(holdMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HoldDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Holds");
        return holdRepository.findAll(pageable).map(holdMapper::toDto);
    }

    @Override
    public Page<HoldDTO> findCurrent(Pageable pageable) {
        return SecurityUtils
            .getCurrentUserLogin()
            .map(login -> {
                log.debug("Request to get current Holds of user: {}", login);
                return holdRepository.findByPatronUserLoginAndEndTimeAfter(login, Instant.now(), pageable).map(holdMapper::toDto);
            })
            .orElse(Page.empty());
    }

    @Override
    public Page<HoldDTO> findByKeyword(String keyword, Pageable pageable) {
        log.debug("Request to find Holds by keyword: {}", keyword);
        return holdRepository.findByKeyword(keyword.trim(), pageable).map(holdMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HoldDTO> findOne(Long id) {
        log.debug("Request to get Hold : {}", id);
        return holdRepository.findById(id).map(holdMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Hold : {}", id);
        holdRepository
            .findById(id)
            .ifPresent(hold -> {
                var bookCopy = hold.getCopy().status(BookCopyStatus.AVAILABLE);
                bookCopyRepository.save(bookCopy);

                jobSchedulerService.cancelJob(HOLD_EXPIRATION, id);
                holdRepository.delete(hold);
            });
    }

    public void handleExpiration(Hold hold) {
        log.debug("Hold expired: " + hold.getId());

        BookCopy bookCopy = hold.getCopy().status(BookCopyStatus.AVAILABLE);
        bookCopyRepository.save(bookCopy);
    }

    private void scheduleJobOnExpiration(Hold hold) {
        jobSchedulerService.scheduleJob(HOLD_EXPIRATION, hold.getId(), hold.getEndTime(), () -> handleExpiration(hold));
    }
}
