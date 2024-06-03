package vdt.se.nda.elibrary.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.repository.HoldRepository;
import vdt.se.nda.elibrary.service.HoldService;
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

    public HoldServiceImpl(HoldRepository holdRepository, HoldMapper holdMapper) {
        this.holdRepository = holdRepository;
        this.holdMapper = holdMapper;
    }

    @Override
    public HoldDTO save(HoldDTO holdDTO) {
        log.debug("Request to save Hold : {}", holdDTO);
        Hold hold = holdMapper.toEntity(holdDTO);
        hold = holdRepository.save(hold);
        return holdMapper.toDto(hold);
    }

    @Override
    public HoldDTO update(HoldDTO holdDTO) {
        log.debug("Request to update Hold : {}", holdDTO);
        Hold hold = holdMapper.toEntity(holdDTO);
        hold = holdRepository.save(hold);
        return holdMapper.toDto(hold);
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
    @Transactional(readOnly = true)
    public Optional<HoldDTO> findOne(Long id) {
        log.debug("Request to get Hold : {}", id);
        return holdRepository.findById(id).map(holdMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Hold : {}", id);
        holdRepository.deleteById(id);
    }
}
