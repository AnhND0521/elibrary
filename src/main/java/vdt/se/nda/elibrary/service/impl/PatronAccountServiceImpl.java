package vdt.se.nda.elibrary.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vdt.se.nda.elibrary.domain.PatronAccount;
import vdt.se.nda.elibrary.repository.PatronAccountRepository;
import vdt.se.nda.elibrary.service.PatronAccountService;
import vdt.se.nda.elibrary.service.dto.PatronAccountDTO;
import vdt.se.nda.elibrary.service.mapper.PatronAccountMapper;

/**
 * Service Implementation for managing {@link PatronAccount}.
 */
@Service
@Transactional
public class PatronAccountServiceImpl implements PatronAccountService {

    private final Logger log = LoggerFactory.getLogger(PatronAccountServiceImpl.class);

    private final PatronAccountRepository patronAccountRepository;

    private final PatronAccountMapper patronAccountMapper;

    public PatronAccountServiceImpl(PatronAccountRepository patronAccountRepository, PatronAccountMapper patronAccountMapper) {
        this.patronAccountRepository = patronAccountRepository;
        this.patronAccountMapper = patronAccountMapper;
    }

    @Override
    public PatronAccountDTO save(PatronAccountDTO patronAccountDTO) {
        log.debug("Request to save PatronAccount : {}", patronAccountDTO);
        PatronAccount patronAccount = patronAccountMapper.toEntity(patronAccountDTO);
        patronAccount = patronAccountRepository.save(patronAccount);
        return patronAccountMapper.toDto(patronAccount);
    }

    @Override
    public PatronAccountDTO update(PatronAccountDTO patronAccountDTO) {
        log.debug("Request to update PatronAccount : {}", patronAccountDTO);
        PatronAccount patronAccount = patronAccountMapper.toEntity(patronAccountDTO);
        patronAccount.setIsPersisted();
        patronAccount = patronAccountRepository.save(patronAccount);
        return patronAccountMapper.toDto(patronAccount);
    }

    @Override
    public Optional<PatronAccountDTO> partialUpdate(PatronAccountDTO patronAccountDTO) {
        log.debug("Request to partially update PatronAccount : {}", patronAccountDTO);

        return patronAccountRepository
            .findById(patronAccountDTO.getCardNumber())
            .map(existingPatronAccount -> {
                patronAccountMapper.partialUpdate(existingPatronAccount, patronAccountDTO);

                return existingPatronAccount;
            })
            .map(patronAccountRepository::save)
            .map(patronAccountMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PatronAccountDTO> findAll(Pageable pageable) {
        log.debug("Request to get all PatronAccounts");
        return patronAccountRepository.findAll(pageable).map(patronAccountMapper::toDto);
    }

    public Page<PatronAccountDTO> findAllWithEagerRelationships(Pageable pageable) {
        return patronAccountRepository.findAllWithEagerRelationships(pageable).map(patronAccountMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PatronAccountDTO> findOne(String id) {
        log.debug("Request to get PatronAccount : {}", id);
        return patronAccountRepository.findOneWithEagerRelationships(id).map(patronAccountMapper::toDto);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete PatronAccount : {}", id);
        patronAccountRepository.deleteById(id);
    }
}
