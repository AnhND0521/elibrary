package vdt.se.nda.elibrary.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.WaitlistItem;
import vdt.se.nda.elibrary.repository.WaitlistItemRepository;
import vdt.se.nda.elibrary.security.SecurityUtils;
import vdt.se.nda.elibrary.service.WaitlistItemService;
import vdt.se.nda.elibrary.service.dto.WaitlistItemDTO;
import vdt.se.nda.elibrary.service.mapper.WaitlistItemMapper;

/**
 * Service Implementation for managing {@link WaitlistItem}.
 */
@Service
@Transactional
public class WaitlistItemServiceImpl implements WaitlistItemService {

    private final Logger log = LoggerFactory.getLogger(WaitlistItemServiceImpl.class);

    private final WaitlistItemRepository waitlistItemRepository;

    private final WaitlistItemMapper waitlistItemMapper;

    public WaitlistItemServiceImpl(WaitlistItemRepository waitlistItemRepository, WaitlistItemMapper waitlistItemMapper) {
        this.waitlistItemRepository = waitlistItemRepository;
        this.waitlistItemMapper = waitlistItemMapper;
    }

    @Override
    public WaitlistItemDTO save(WaitlistItemDTO waitlistItemDTO) {
        log.debug("Request to save WaitlistItem : {}", waitlistItemDTO);

        WaitlistItem waitlistItem = waitlistItemRepository
            .findByPatronCardNumberAndBookId(waitlistItemDTO.getPatron().getCardNumber(), waitlistItemDTO.getBook().getId())
            .orElse(null);
        if (waitlistItem != null) return waitlistItemMapper.toDto(waitlistItem);

        waitlistItem = waitlistItemMapper.toEntity(waitlistItemDTO);
        waitlistItem = waitlistItemRepository.save(waitlistItem);
        return waitlistItemMapper.toDto(waitlistItem);
    }

    @Override
    public WaitlistItemDTO update(WaitlistItemDTO waitlistItemDTO) {
        log.debug("Request to update WaitlistItem : {}", waitlistItemDTO);
        WaitlistItem waitlistItem = waitlistItemMapper.toEntity(waitlistItemDTO);
        waitlistItem = waitlistItemRepository.save(waitlistItem);
        return waitlistItemMapper.toDto(waitlistItem);
    }

    @Override
    public Optional<WaitlistItemDTO> partialUpdate(WaitlistItemDTO waitlistItemDTO) {
        log.debug("Request to partially update WaitlistItem : {}", waitlistItemDTO);

        return waitlistItemRepository
            .findById(waitlistItemDTO.getId())
            .map(existingWaitlistItem -> {
                waitlistItemMapper.partialUpdate(existingWaitlistItem, waitlistItemDTO);

                return existingWaitlistItem;
            })
            .map(waitlistItemRepository::save)
            .map(waitlistItemMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WaitlistItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all WaitlistItems");
        return waitlistItemRepository.findAll(pageable).map(waitlistItemMapper::toDto);
    }

    public Page<WaitlistItemDTO> findAllWithEagerRelationships(Pageable pageable) {
        return waitlistItemRepository.findAllWithEagerRelationships(pageable).map(waitlistItemMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<WaitlistItemDTO> findOne(Long id) {
        log.debug("Request to get WaitlistItem : {}", id);
        return waitlistItemRepository.findOneWithEagerRelationships(id).map(waitlistItemMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete WaitlistItem : {}", id);
        waitlistItemRepository.deleteById(id);
    }

    @Override
    public Page<WaitlistItemDTO> findByCurrentUser(Pageable pageable) {
        return SecurityUtils
            .getCurrentUserLogin()
            .map(login -> waitlistItemRepository.findByPatronUserLogin(login, pageable).map(waitlistItemMapper::toDto))
            .orElse(Page.empty());
    }
}
