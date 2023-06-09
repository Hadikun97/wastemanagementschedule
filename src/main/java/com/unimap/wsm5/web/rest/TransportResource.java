package com.unimap.wsm5.web.rest;

import com.unimap.wsm5.domain.Transport;
import com.unimap.wsm5.repository.TransportRepository;
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
 * REST controller for managing {@link com.unimap.wsm5.domain.Transport}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TransportResource {

    private final Logger log = LoggerFactory.getLogger(TransportResource.class);

    private static final String ENTITY_NAME = "transport";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TransportRepository transportRepository;

    public TransportResource(TransportRepository transportRepository) {
        this.transportRepository = transportRepository;
    }

    /**
     * {@code POST  /transports} : Create a new transport.
     *
     * @param transport the transport to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new transport, or with status {@code 400 (Bad Request)} if the transport has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/transports")
    public ResponseEntity<Transport> createTransport(@Valid @RequestBody Transport transport) throws URISyntaxException {
        log.debug("REST request to save Transport : {}", transport);
        if (transport.getId() != null) {
            throw new BadRequestAlertException("A new transport cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transport result = transportRepository.save(transport);
        return ResponseEntity
            .created(new URI("/api/transports/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /transports/:id} : Updates an existing transport.
     *
     * @param id the id of the transport to save.
     * @param transport the transport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transport,
     * or with status {@code 400 (Bad Request)} if the transport is not valid,
     * or with status {@code 500 (Internal Server Error)} if the transport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/transports/{id}")
    public ResponseEntity<Transport> updateTransport(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Transport transport
    ) throws URISyntaxException {
        log.debug("REST request to update Transport : {}, {}", id, transport);
        if (transport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, transport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!transportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Transport result = transportRepository.save(transport);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, transport.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /transports/:id} : Partial updates given fields of an existing transport, field will ignore if it is null
     *
     * @param id the id of the transport to save.
     * @param transport the transport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transport,
     * or with status {@code 400 (Bad Request)} if the transport is not valid,
     * or with status {@code 404 (Not Found)} if the transport is not found,
     * or with status {@code 500 (Internal Server Error)} if the transport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/transports/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Transport> partialUpdateTransport(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Transport transport
    ) throws URISyntaxException {
        log.debug("REST request to partial update Transport partially : {}, {}", id, transport);
        if (transport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, transport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!transportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Transport> result = transportRepository
            .findById(transport.getId())
            .map(existingTransport -> {
                if (transport.getTransportNo() != null) {
                    existingTransport.setTransportNo(transport.getTransportNo());
                }
                if (transport.getRegsNo() != null) {
                    existingTransport.setRegsNo(transport.getRegsNo());
                }
                if (transport.getType() != null) {
                    existingTransport.setType(transport.getType());
                }

                return existingTransport;
            })
            .map(transportRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, transport.getId().toString())
        );
    }

    /**
     * {@code GET  /transports} : get all the transports.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of transports in body.
     */
    @GetMapping("/transports")
    public List<Transport> getAllTransports() {
        log.debug("REST request to get all Transports");
        return transportRepository.findAll();
    }

    /**
     * {@code GET  /transports/:id} : get the "id" transport.
     *
     * @param id the id of the transport to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the transport, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/transports/{id}")
    public ResponseEntity<Transport> getTransport(@PathVariable Long id) {
        log.debug("REST request to get Transport : {}", id);
        Optional<Transport> transport = transportRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(transport);
    }

    /**
     * {@code DELETE  /transports/:id} : delete the "id" transport.
     *
     * @param id the id of the transport to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/transports/{id}")
    public ResponseEntity<Void> deleteTransport(@PathVariable Long id) {
        log.debug("REST request to delete Transport : {}", id);
        transportRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
