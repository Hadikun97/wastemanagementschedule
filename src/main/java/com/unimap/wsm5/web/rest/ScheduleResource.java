package com.unimap.wsm5.web.rest;

import com.unimap.wsm5.domain.Schedule;
import com.unimap.wsm5.repository.ScheduleRepository;
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
 * REST controller for managing {@link com.unimap.wsm5.domain.Schedule}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ScheduleResource {

    private final Logger log = LoggerFactory.getLogger(ScheduleResource.class);

    private static final String ENTITY_NAME = "schedule";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ScheduleRepository scheduleRepository;

    public ScheduleResource(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    /**
     * {@code POST  /schedules} : Create a new schedule.
     *
     * @param schedule the schedule to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new schedule, or with status {@code 400 (Bad Request)} if the schedule has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/schedules")
    public ResponseEntity<Schedule> createSchedule(@Valid @RequestBody Schedule schedule) throws URISyntaxException {
        log.debug("REST request to save Schedule : {}", schedule);
        if (schedule.getId() != null) {
            throw new BadRequestAlertException("A new schedule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Schedule result = scheduleRepository.save(schedule);
        return ResponseEntity
            .created(new URI("/api/schedules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /schedules/:id} : Updates an existing schedule.
     *
     * @param id the id of the schedule to save.
     * @param schedule the schedule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated schedule,
     * or with status {@code 400 (Bad Request)} if the schedule is not valid,
     * or with status {@code 500 (Internal Server Error)} if the schedule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/schedules/{id}")
    public ResponseEntity<Schedule> updateSchedule(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Schedule schedule
    ) throws URISyntaxException {
        log.debug("REST request to update Schedule : {}, {}", id, schedule);
        if (schedule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, schedule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scheduleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Schedule result = scheduleRepository.save(schedule);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, schedule.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /schedules/:id} : Partial updates given fields of an existing schedule, field will ignore if it is null
     *
     * @param id the id of the schedule to save.
     * @param schedule the schedule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated schedule,
     * or with status {@code 400 (Bad Request)} if the schedule is not valid,
     * or with status {@code 404 (Not Found)} if the schedule is not found,
     * or with status {@code 500 (Internal Server Error)} if the schedule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/schedules/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Schedule> partialUpdateSchedule(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Schedule schedule
    ) throws URISyntaxException {
        log.debug("REST request to partial update Schedule partially : {}, {}", id, schedule);
        if (schedule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, schedule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scheduleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Schedule> result = scheduleRepository
            .findById(schedule.getId())
            .map(existingSchedule -> {
                if (schedule.getArea() != null) {
                    existingSchedule.setArea(schedule.getArea());
                }
                if (schedule.getRegion() != null) {
                    existingSchedule.setRegion(schedule.getRegion());
                }
                if (schedule.getState() != null) {
                    existingSchedule.setState(schedule.getState());
                }
                if (schedule.getActivity() != null) {
                    existingSchedule.setActivity(schedule.getActivity());
                }
                if (schedule.getDate() != null) {
                    existingSchedule.setDate(schedule.getDate());
                }
                if (schedule.getDay() != null) {
                    existingSchedule.setDay(schedule.getDay());
                }

                return existingSchedule;
            })
            .map(scheduleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, schedule.getId().toString())
        );
    }

    /**
     * {@code GET  /schedules} : get all the schedules.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of schedules in body.
     */
    @GetMapping("/schedules")
    public List<Schedule> getAllSchedules(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Schedules");
        if (eagerload) {
            return scheduleRepository.findAllWithEagerRelationships();
        } else {
            return scheduleRepository.findAll();
        }
    }

    /**
     * {@code GET  /schedules/:id} : get the "id" schedule.
     *
     * @param id the id of the schedule to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the schedule, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/schedules/{id}")
    public ResponseEntity<Schedule> getSchedule(@PathVariable Long id) {
        log.debug("REST request to get Schedule : {}", id);
        Optional<Schedule> schedule = scheduleRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(schedule);
    }

    /**
     * {@code DELETE  /schedules/:id} : delete the "id" schedule.
     *
     * @param id the id of the schedule to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        log.debug("REST request to delete Schedule : {}", id);
        scheduleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
