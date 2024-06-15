package vdt.se.nda.elibrary.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import vdt.se.nda.elibrary.repository.HoldRepository;
import vdt.se.nda.elibrary.security.SecurityUtils;
import vdt.se.nda.elibrary.service.HoldService;
import vdt.se.nda.elibrary.service.dto.HoldDTO;
import vdt.se.nda.elibrary.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link vdt.se.nda.elibrary.domain.Hold}.
 */
@RestController
@RequestMapping("/api")
public class HoldResource {

    private final Logger log = LoggerFactory.getLogger(HoldResource.class);

    private static final String ENTITY_NAME = "hold";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HoldService holdService;

    private final HoldRepository holdRepository;

    public HoldResource(HoldService holdService, HoldRepository holdRepository) {
        this.holdService = holdService;
        this.holdRepository = holdRepository;
    }

    /**
     * {@code POST  /holds} : Create a new hold.
     *
     * @param holdDTO the holdDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new holdDTO, or with status {@code 400 (Bad Request)} if the hold has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/holds")
    public ResponseEntity<HoldDTO> createHold(@RequestBody HoldDTO holdDTO) throws URISyntaxException {
        log.debug("REST request to save Hold : {}", holdDTO);
        if (holdDTO.getId() != null) {
            throw new BadRequestAlertException("A new hold cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HoldDTO result = holdService.save(holdDTO);
        return ResponseEntity
            .created(new URI("/api/holds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /holds/:id} : Updates an existing hold.
     *
     * @param id      the id of the holdDTO to save.
     * @param holdDTO the holdDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated holdDTO,
     * or with status {@code 400 (Bad Request)} if the holdDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the holdDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/holds/{id}")
    public ResponseEntity<HoldDTO> updateHold(@PathVariable(value = "id", required = false) final Long id, @RequestBody HoldDTO holdDTO)
        throws URISyntaxException {
        log.debug("REST request to update Hold : {}, {}", id, holdDTO);
        if (holdDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, holdDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!holdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HoldDTO result = holdService.update(holdDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, holdDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /holds/:id} : Partial updates given fields of an existing hold, field will ignore if it is null
     *
     * @param id      the id of the holdDTO to save.
     * @param holdDTO the holdDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated holdDTO,
     * or with status {@code 400 (Bad Request)} if the holdDTO is not valid,
     * or with status {@code 404 (Not Found)} if the holdDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the holdDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/holds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HoldDTO> partialUpdateHold(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HoldDTO holdDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Hold partially : {}, {}", id, holdDTO);
        if (holdDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, holdDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!holdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HoldDTO> result = holdService.partialUpdate(holdDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, holdDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /holds} : get all the holds.
     *
     * @param keyword  the keyword to find holds if any.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of holds in body.
     */
    @GetMapping("/holds")
    public ResponseEntity<List<HoldDTO>> getAllHolds(
        @RequestParam(name = "q", required = false, defaultValue = "") String keyword,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of Holds");
        Page<HoldDTO> page;
        if (keyword == null || keyword.isEmpty()) page = holdService.findAll(pageable); else page =
            holdService.findByKeyword(keyword, pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /holds/my/current} : get all current holds of the current user.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of holds in body.
     */
    @GetMapping("/holds/my/current")
    public ResponseEntity<List<HoldDTO>> getAllHolds(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Holds");
        Page<HoldDTO> page = holdService.findCurrent(pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /holds/:id} : get the "id" hold.
     *
     * @param id the id of the holdDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the holdDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/holds/{id}")
    public ResponseEntity<HoldDTO> getHold(@PathVariable Long id) {
        log.debug("REST request to get Hold : {}", id);
        Optional<HoldDTO> holdDTO = holdService.findOne(id);
        return ResponseUtil.wrapOrNotFound(holdDTO);
    }

    /**
     * {@code DELETE  /holds/:id} : delete the "id" hold.
     *
     * @param id the id of the holdDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/holds/{id}")
    public ResponseEntity<Void> deleteHold(@PathVariable Long id) {
        log.debug("REST request to delete Hold : {}", id);
        holdService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
