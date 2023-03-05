package com.unimap.wsm5.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.unimap.wsm5.IntegrationTest;
import com.unimap.wsm5.domain.OnDuty;
import com.unimap.wsm5.domain.Staff;
import com.unimap.wsm5.domain.Transport;
import com.unimap.wsm5.repository.OnDutyRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OnDutyResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class OnDutyResourceIT {

    private static final String DEFAULT_DUTY_NO = "AAAAAAAAAA";
    private static final String UPDATED_DUTY_NO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/on-duties";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OnDutyRepository onDutyRepository;

    @Mock
    private OnDutyRepository onDutyRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOnDutyMockMvc;

    private OnDuty onDuty;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OnDuty createEntity(EntityManager em) {
        OnDuty onDuty = new OnDuty().dutyNo(DEFAULT_DUTY_NO);
        // Add required entity
        Staff staff;
        if (TestUtil.findAll(em, Staff.class).isEmpty()) {
            staff = StaffResourceIT.createEntity(em);
            em.persist(staff);
            em.flush();
        } else {
            staff = TestUtil.findAll(em, Staff.class).get(0);
        }
        onDuty.setStaff(staff);
        // Add required entity
        Transport transport;
        if (TestUtil.findAll(em, Transport.class).isEmpty()) {
            transport = TransportResourceIT.createEntity(em);
            em.persist(transport);
            em.flush();
        } else {
            transport = TestUtil.findAll(em, Transport.class).get(0);
        }
        onDuty.setTransport(transport);
        return onDuty;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OnDuty createUpdatedEntity(EntityManager em) {
        OnDuty onDuty = new OnDuty().dutyNo(UPDATED_DUTY_NO);
        // Add required entity
        Staff staff;
        if (TestUtil.findAll(em, Staff.class).isEmpty()) {
            staff = StaffResourceIT.createUpdatedEntity(em);
            em.persist(staff);
            em.flush();
        } else {
            staff = TestUtil.findAll(em, Staff.class).get(0);
        }
        onDuty.setStaff(staff);
        // Add required entity
        Transport transport;
        if (TestUtil.findAll(em, Transport.class).isEmpty()) {
            transport = TransportResourceIT.createUpdatedEntity(em);
            em.persist(transport);
            em.flush();
        } else {
            transport = TestUtil.findAll(em, Transport.class).get(0);
        }
        onDuty.setTransport(transport);
        return onDuty;
    }

    @BeforeEach
    public void initTest() {
        onDuty = createEntity(em);
    }

    @Test
    @Transactional
    void createOnDuty() throws Exception {
        int databaseSizeBeforeCreate = onDutyRepository.findAll().size();
        // Create the OnDuty
        restOnDutyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(onDuty)))
            .andExpect(status().isCreated());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeCreate + 1);
        OnDuty testOnDuty = onDutyList.get(onDutyList.size() - 1);
        assertThat(testOnDuty.getDutyNo()).isEqualTo(DEFAULT_DUTY_NO);
    }

    @Test
    @Transactional
    void createOnDutyWithExistingId() throws Exception {
        // Create the OnDuty with an existing ID
        onDuty.setId(1L);

        int databaseSizeBeforeCreate = onDutyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOnDutyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(onDuty)))
            .andExpect(status().isBadRequest());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOnDuties() throws Exception {
        // Initialize the database
        onDutyRepository.saveAndFlush(onDuty);

        // Get all the onDutyList
        restOnDutyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(onDuty.getId().intValue())))
            .andExpect(jsonPath("$.[*].dutyNo").value(hasItem(DEFAULT_DUTY_NO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOnDutiesWithEagerRelationshipsIsEnabled() throws Exception {
        when(onDutyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOnDutyMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(onDutyRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOnDutiesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(onDutyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOnDutyMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(onDutyRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getOnDuty() throws Exception {
        // Initialize the database
        onDutyRepository.saveAndFlush(onDuty);

        // Get the onDuty
        restOnDutyMockMvc
            .perform(get(ENTITY_API_URL_ID, onDuty.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(onDuty.getId().intValue()))
            .andExpect(jsonPath("$.dutyNo").value(DEFAULT_DUTY_NO));
    }

    @Test
    @Transactional
    void getNonExistingOnDuty() throws Exception {
        // Get the onDuty
        restOnDutyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOnDuty() throws Exception {
        // Initialize the database
        onDutyRepository.saveAndFlush(onDuty);

        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();

        // Update the onDuty
        OnDuty updatedOnDuty = onDutyRepository.findById(onDuty.getId()).get();
        // Disconnect from session so that the updates on updatedOnDuty are not directly saved in db
        em.detach(updatedOnDuty);
        updatedOnDuty.dutyNo(UPDATED_DUTY_NO);

        restOnDutyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOnDuty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOnDuty))
            )
            .andExpect(status().isOk());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
        OnDuty testOnDuty = onDutyList.get(onDutyList.size() - 1);
        assertThat(testOnDuty.getDutyNo()).isEqualTo(UPDATED_DUTY_NO);
    }

    @Test
    @Transactional
    void putNonExistingOnDuty() throws Exception {
        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();
        onDuty.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOnDutyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, onDuty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(onDuty))
            )
            .andExpect(status().isBadRequest());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOnDuty() throws Exception {
        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();
        onDuty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnDutyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(onDuty))
            )
            .andExpect(status().isBadRequest());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOnDuty() throws Exception {
        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();
        onDuty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnDutyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(onDuty)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOnDutyWithPatch() throws Exception {
        // Initialize the database
        onDutyRepository.saveAndFlush(onDuty);

        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();

        // Update the onDuty using partial update
        OnDuty partialUpdatedOnDuty = new OnDuty();
        partialUpdatedOnDuty.setId(onDuty.getId());

        restOnDutyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOnDuty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOnDuty))
            )
            .andExpect(status().isOk());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
        OnDuty testOnDuty = onDutyList.get(onDutyList.size() - 1);
        assertThat(testOnDuty.getDutyNo()).isEqualTo(DEFAULT_DUTY_NO);
    }

    @Test
    @Transactional
    void fullUpdateOnDutyWithPatch() throws Exception {
        // Initialize the database
        onDutyRepository.saveAndFlush(onDuty);

        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();

        // Update the onDuty using partial update
        OnDuty partialUpdatedOnDuty = new OnDuty();
        partialUpdatedOnDuty.setId(onDuty.getId());

        partialUpdatedOnDuty.dutyNo(UPDATED_DUTY_NO);

        restOnDutyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOnDuty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOnDuty))
            )
            .andExpect(status().isOk());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
        OnDuty testOnDuty = onDutyList.get(onDutyList.size() - 1);
        assertThat(testOnDuty.getDutyNo()).isEqualTo(UPDATED_DUTY_NO);
    }

    @Test
    @Transactional
    void patchNonExistingOnDuty() throws Exception {
        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();
        onDuty.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOnDutyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, onDuty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(onDuty))
            )
            .andExpect(status().isBadRequest());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOnDuty() throws Exception {
        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();
        onDuty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnDutyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(onDuty))
            )
            .andExpect(status().isBadRequest());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOnDuty() throws Exception {
        int databaseSizeBeforeUpdate = onDutyRepository.findAll().size();
        onDuty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnDutyMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(onDuty)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OnDuty in the database
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOnDuty() throws Exception {
        // Initialize the database
        onDutyRepository.saveAndFlush(onDuty);

        int databaseSizeBeforeDelete = onDutyRepository.findAll().size();

        // Delete the onDuty
        restOnDutyMockMvc
            .perform(delete(ENTITY_API_URL_ID, onDuty.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OnDuty> onDutyList = onDutyRepository.findAll();
        assertThat(onDutyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
