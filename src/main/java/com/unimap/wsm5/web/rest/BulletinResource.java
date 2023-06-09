package com.unimap.wsm5.web.rest;

import com.unimap.wsm5.domain.Bulletin;
import com.unimap.wsm5.repository.BulletinRepository;
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
 * REST controller for managing {@link com.unimap.wsm5.domain.Bulletin}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BulletinResource {

    private final Logger log = LoggerFactory.getLogger(BulletinResource.class);

    private static final String ENTITY_NAME = "bulletin";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BulletinRepository bulletinRepository;

    public BulletinResource(BulletinRepository bulletinRepository) {
        this.bulletinRepository = bulletinRepository;
    }

    /**
     * {@code POST  /bulletins} : Create a new bulletin.
     *
     * @param bulletin the bulletin to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bulletin, or with status {@code 400 (Bad Request)} if the bulletin has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bulletins")
    public ResponseEntity<Bulletin> createBulletin(@Valid @RequestBody Bulletin bulletin) throws URISyntaxException {
        log.debug("REST request to save Bulletin : {}", bulletin);
        if (bulletin.getId() != null) {
            throw new BadRequestAlertException("A new bulletin cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bulletin result = bulletinRepository.save(bulletin);
        return ResponseEntity
            .created(new URI("/api/bulletins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bulletins/:id} : Updates an existing bulletin.
     *
     * @param id the id of the bulletin to save.
     * @param bulletin the bulletin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bulletin,
     * or with status {@code 400 (Bad Request)} if the bulletin is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bulletin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bulletins/{id}")
    public ResponseEntity<Bulletin> updateBulletin(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Bulletin bulletin
    ) throws URISyntaxException {
        log.debug("REST request to update Bulletin : {}, {}", id, bulletin);
        if (bulletin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bulletin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bulletinRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bulletin result = bulletinRepository.save(bulletin);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bulletin.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bulletins/:id} : Partial updates given fields of an existing bulletin, field will ignore if it is null
     *
     * @param id the id of the bulletin to save.
     * @param bulletin the bulletin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bulletin,
     * or with status {@code 400 (Bad Request)} if the bulletin is not valid,
     * or with status {@code 404 (Not Found)} if the bulletin is not found,
     * or with status {@code 500 (Internal Server Error)} if the bulletin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bulletins/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bulletin> partialUpdateBulletin(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Bulletin bulletin
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bulletin partially : {}, {}", id, bulletin);
        if (bulletin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bulletin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bulletinRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bulletin> result = bulletinRepository
            .findById(bulletin.getId())
            .map(existingBulletin -> {
                if (bulletin.getTitle() != null) {
                    existingBulletin.setTitle(bulletin.getTitle());
                }
                if (bulletin.getDescription() != null) {
                    existingBulletin.setDescription(bulletin.getDescription());
                }
                if (bulletin.getName() != null) {
                    existingBulletin.setName(bulletin.getName());
                }
                if (bulletin.getContactNo() != null) {
                    existingBulletin.setContactNo(bulletin.getContactNo());
                }

                return existingBulletin;
            })
            .map(bulletinRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bulletin.getId().toString())
        );
    }

    /**
     * {@code GET  /bulletins} : get all the bulletins.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bulletins in body.
     */
    @GetMapping("/bulletins")
    public List<Bulletin> getAllBulletins() {
        log.debug("REST request to get all Bulletins");
        return bulletinRepository.findAll();
    }

    /**
     * {@code GET  /bulletins/:id} : get the "id" bulletin.
     *
     * @param id the id of the bulletin to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bulletin, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bulletins/{id}")
    public ResponseEntity<Bulletin> getBulletin(@PathVariable Long id) {
        log.debug("REST request to get Bulletin : {}", id);
        Optional<Bulletin> bulletin = bulletinRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bulletin);
    }

    /**
     * {@code DELETE  /bulletins/:id} : delete the "id" bulletin.
     *
     * @param id the id of the bulletin to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bulletins/{id}")
    public ResponseEntity<Void> deleteBulletin(@PathVariable Long id) {
        log.debug("REST request to delete Bulletin : {}", id);
        bulletinRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
