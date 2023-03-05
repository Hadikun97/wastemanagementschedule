package com.unimap.wsm5.web.rest;

import com.unimap.wsm5.domain.OnDuty;
import com.unimap.wsm5.repository.OnDutyRepository;
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
 * REST controller for managing {@link com.unimap.wsm5.domain.OnDuty}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OnDutyResource {

    private final Logger log = LoggerFactory.getLogger(OnDutyResource.class);

    private static final String ENTITY_NAME = "onDuty";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OnDutyRepository onDutyRepository;

    public OnDutyResource(OnDutyRepository onDutyRepository) {
        this.onDutyRepository = onDutyRepository;
    }

    /**
     * {@code POST  /on-duties} : Create a new onDuty.
     *
     * @param onDuty the onDuty to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new onDuty, or with status {@code 400 (Bad Request)} if the onDuty has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/on-duties")
    public ResponseEntity<OnDuty> createOnDuty(@Valid @RequestBody OnDuty onDuty) throws URISyntaxException {
        log.debug("REST request to save OnDuty : {}", onDuty);
        if (onDuty.getId() != null) {
            throw new BadRequestAlertException("A new onDuty cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OnDuty result = onDutyRepository.save(onDuty);
        return ResponseEntity
            .created(new URI("/api/on-duties/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /on-duties/:id} : Updates an existing onDuty.
     *
     * @param id the id of the onDuty to save.
     * @param onDuty the onDuty to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated onDuty,
     * or with status {@code 400 (Bad Request)} if the onDuty is not valid,
     * or with status {@code 500 (Internal Server Error)} if the onDuty couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/on-duties/{id}")
    public ResponseEntity<OnDuty> updateOnDuty(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OnDuty onDuty
    ) throws URISyntaxException {
        log.debug("REST request to update OnDuty : {}, {}", id, onDuty);
        if (onDuty.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, onDuty.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!onDutyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OnDuty result = onDutyRepository.save(onDuty);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, onDuty.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /on-duties/:id} : Partial updates given fields of an existing onDuty, field will ignore if it is null
     *
     * @param id the id of the onDuty to save.
     * @param onDuty the onDuty to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated onDuty,
     * or with status {@code 400 (Bad Request)} if the onDuty is not valid,
     * or with status {@code 404 (Not Found)} if the onDuty is not found,
     * or with status {@code 500 (Internal Server Error)} if the onDuty couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/on-duties/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OnDuty> partialUpdateOnDuty(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OnDuty onDuty
    ) throws URISyntaxException {
        log.debug("REST request to partial update OnDuty partially : {}, {}", id, onDuty);
        if (onDuty.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, onDuty.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!onDutyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OnDuty> result = onDutyRepository
            .findById(onDuty.getId())
            .map(existingOnDuty -> {
                if (onDuty.getDutyNo() != null) {
                    existingOnDuty.setDutyNo(onDuty.getDutyNo());
                }

                return existingOnDuty;
            })
            .map(onDutyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, onDuty.getId().toString())
        );
    }

    /**
     * {@code GET  /on-duties} : get all the onDuties.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of onDuties in body.
     */
    @GetMapping("/on-duties")
    public List<OnDuty> getAllOnDuties(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all OnDuties");
        if (eagerload) {
            return onDutyRepository.findAllWithEagerRelationships();
        } else {
            return onDutyRepository.findAll();
        }
    }

    /**
     * {@code GET  /on-duties/:id} : get the "id" onDuty.
     *
     * @param id the id of the onDuty to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the onDuty, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/on-duties/{id}")
    public ResponseEntity<OnDuty> getOnDuty(@PathVariable Long id) {
        log.debug("REST request to get OnDuty : {}", id);
        Optional<OnDuty> onDuty = onDutyRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(onDuty);
    }

    /**
     * {@code DELETE  /on-duties/:id} : delete the "id" onDuty.
     *
     * @param id the id of the onDuty to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/on-duties/{id}")
    public ResponseEntity<Void> deleteOnDuty(@PathVariable Long id) {
        log.debug("REST request to delete OnDuty : {}", id);
        onDutyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
