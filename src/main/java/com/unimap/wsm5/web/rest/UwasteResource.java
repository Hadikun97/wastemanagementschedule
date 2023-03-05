package com.unimap.wsm5.web.rest;

import com.unimap.wsm5.domain.Uwaste;
import com.unimap.wsm5.repository.UwasteRepository;
import com.unimap.wsm5.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.unimap.wsm5.domain.Uwaste}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UwasteResource {

    private final Logger log = LoggerFactory.getLogger(UwasteResource.class);

    private static final String ENTITY_NAME = "uwaste";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UwasteRepository uwasteRepository;

    public UwasteResource(UwasteRepository uwasteRepository) {
        this.uwasteRepository = uwasteRepository;
    }

    /**
     * {@code POST  /uwastes} : Create a new uwaste.
     *
     * @param uwaste the uwaste to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new uwaste, or with status {@code 400 (Bad Request)} if the uwaste has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/uwastes")
    public ResponseEntity<Uwaste> createUwaste(@Valid @RequestBody Uwaste uwaste) throws URISyntaxException {
        log.debug("REST request to save Uwaste : {}", uwaste);
        if (uwaste.getId() != null) {
            throw new BadRequestAlertException("A new uwaste cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Uwaste result = uwasteRepository.save(uwaste);
        return ResponseEntity
            .created(new URI("/api/uwastes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /uwastes/:id} : Updates an existing uwaste.
     *
     * @param id the id of the uwaste to save.
     * @param uwaste the uwaste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated uwaste,
     * or with status {@code 400 (Bad Request)} if the uwaste is not valid,
     * or with status {@code 500 (Internal Server Error)} if the uwaste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/uwastes/{id}")
    public ResponseEntity<Uwaste> updateUwaste(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Uwaste uwaste
    ) throws URISyntaxException {
        log.debug("REST request to update Uwaste : {}, {}", id, uwaste);
        if (uwaste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, uwaste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!uwasteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Uwaste result = uwasteRepository.save(uwaste);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, uwaste.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /uwastes/:id} : Partial updates given fields of an existing uwaste, field will ignore if it is null
     *
     * @param id the id of the uwaste to save.
     * @param uwaste the uwaste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated uwaste,
     * or with status {@code 400 (Bad Request)} if the uwaste is not valid,
     * or with status {@code 404 (Not Found)} if the uwaste is not found,
     * or with status {@code 500 (Internal Server Error)} if the uwaste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/uwastes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Uwaste> partialUpdateUwaste(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Uwaste uwaste
    ) throws URISyntaxException {
        log.debug("REST request to partial update Uwaste partially : {}, {}", id, uwaste);
        if (uwaste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, uwaste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!uwasteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Uwaste> result = uwasteRepository
            .findById(uwaste.getId())
            .map(existingUwaste -> {
                if (uwaste.getDescription() != null) {
                    existingUwaste.setDescription(uwaste.getDescription());
                }
                if (uwaste.getName() != null) {
                    existingUwaste.setName(uwaste.getName());
                }
                if (uwaste.getContactNo() != null) {
                    existingUwaste.setContactNo(uwaste.getContactNo());
                }
                if (uwaste.getAddress() != null) {
                    existingUwaste.setAddress(uwaste.getAddress());
                }

                return existingUwaste;
            })
            .map(uwasteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, uwaste.getId().toString())
        );
    }

    /**
     * {@code GET  /uwastes} : get all the uwastes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of uwastes in body.
     */
    @GetMapping("/uwastes")
    public List<Uwaste> getAllUwastes() {
        log.debug("REST request to get all Uwastes");
        return uwasteRepository.findAll();
    }

    /**
     * {@code GET  /uwastes/:id} : get the "id" uwaste.
     *
     * @param id the id of the uwaste to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the uwaste, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/uwastes/{id}")
    public ResponseEntity<Uwaste> getUwaste(@PathVariable Long id) {
        log.debug("REST request to get Uwaste : {}", id);
        Optional<Uwaste> uwaste = uwasteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(uwaste);
    }

    /**
     * {@code DELETE  /uwastes/:id} : delete the "id" uwaste.
     *
     * @param id the id of the uwaste to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/uwastes/{id}")
    public ResponseEntity<Void> deleteUwaste(@PathVariable Long id) {
        log.debug("REST request to delete Uwaste : {}", id);
        uwasteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
