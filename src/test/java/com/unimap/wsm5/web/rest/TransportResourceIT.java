package com.unimap.wsm5.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.unimap.wsm5.IntegrationTest;
import com.unimap.wsm5.domain.Transport;
import com.unimap.wsm5.domain.enumeration.Types;
import com.unimap.wsm5.repository.TransportRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TransportResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TransportResourceIT {

    private static final String DEFAULT_TRANSPORT_NO = "AAAAAAAAAA";
    private static final String UPDATED_TRANSPORT_NO = "BBBBBBBBBB";

    private static final String DEFAULT_REGS_NO = "AAAAAAAAAA";
    private static final String UPDATED_REGS_NO = "BBBBBBBBBB";

    private static final Types DEFAULT_TYPE = Types.Truck;
    private static final Types UPDATED_TYPE = Types.Garbage_Truck;

    private static final String ENTITY_API_URL = "/api/transports";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TransportRepository transportRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTransportMockMvc;

    private Transport transport;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transport createEntity(EntityManager em) {
        Transport transport = new Transport().transportNo(DEFAULT_TRANSPORT_NO).regsNo(DEFAULT_REGS_NO).type(DEFAULT_TYPE);
        return transport;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transport createUpdatedEntity(EntityManager em) {
        Transport transport = new Transport().transportNo(UPDATED_TRANSPORT_NO).regsNo(UPDATED_REGS_NO).type(UPDATED_TYPE);
        return transport;
    }

    @BeforeEach
    public void initTest() {
        transport = createEntity(em);
    }

    @Test
    @Transactional
    void createTransport() throws Exception {
        int databaseSizeBeforeCreate = transportRepository.findAll().size();
        // Create the Transport
        restTransportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transport)))
            .andExpect(status().isCreated());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeCreate + 1);
        Transport testTransport = transportList.get(transportList.size() - 1);
        assertThat(testTransport.getTransportNo()).isEqualTo(DEFAULT_TRANSPORT_NO);
        assertThat(testTransport.getRegsNo()).isEqualTo(DEFAULT_REGS_NO);
        assertThat(testTransport.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createTransportWithExistingId() throws Exception {
        // Create the Transport with an existing ID
        transport.setId(1L);

        int databaseSizeBeforeCreate = transportRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transport)))
            .andExpect(status().isBadRequest());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTransports() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        // Get all the transportList
        restTransportMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transport.getId().intValue())))
            .andExpect(jsonPath("$.[*].transportNo").value(hasItem(DEFAULT_TRANSPORT_NO)))
            .andExpect(jsonPath("$.[*].regsNo").value(hasItem(DEFAULT_REGS_NO)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    void getTransport() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        // Get the transport
        restTransportMockMvc
            .perform(get(ENTITY_API_URL_ID, transport.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(transport.getId().intValue()))
            .andExpect(jsonPath("$.transportNo").value(DEFAULT_TRANSPORT_NO))
            .andExpect(jsonPath("$.regsNo").value(DEFAULT_REGS_NO))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTransport() throws Exception {
        // Get the transport
        restTransportMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTransport() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        int databaseSizeBeforeUpdate = transportRepository.findAll().size();

        // Update the transport
        Transport updatedTransport = transportRepository.findById(transport.getId()).get();
        // Disconnect from session so that the updates on updatedTransport are not directly saved in db
        em.detach(updatedTransport);
        updatedTransport.transportNo(UPDATED_TRANSPORT_NO).regsNo(UPDATED_REGS_NO).type(UPDATED_TYPE);

        restTransportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTransport.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTransport))
            )
            .andExpect(status().isOk());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
        Transport testTransport = transportList.get(transportList.size() - 1);
        assertThat(testTransport.getTransportNo()).isEqualTo(UPDATED_TRANSPORT_NO);
        assertThat(testTransport.getRegsNo()).isEqualTo(UPDATED_REGS_NO);
        assertThat(testTransport.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingTransport() throws Exception {
        int databaseSizeBeforeUpdate = transportRepository.findAll().size();
        transport.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, transport.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTransport() throws Exception {
        int databaseSizeBeforeUpdate = transportRepository.findAll().size();
        transport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTransport() throws Exception {
        int databaseSizeBeforeUpdate = transportRepository.findAll().size();
        transport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransportMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transport)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTransportWithPatch() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        int databaseSizeBeforeUpdate = transportRepository.findAll().size();

        // Update the transport using partial update
        Transport partialUpdatedTransport = new Transport();
        partialUpdatedTransport.setId(transport.getId());

        partialUpdatedTransport.type(UPDATED_TYPE);

        restTransportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransport.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransport))
            )
            .andExpect(status().isOk());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
        Transport testTransport = transportList.get(transportList.size() - 1);
        assertThat(testTransport.getTransportNo()).isEqualTo(DEFAULT_TRANSPORT_NO);
        assertThat(testTransport.getRegsNo()).isEqualTo(DEFAULT_REGS_NO);
        assertThat(testTransport.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateTransportWithPatch() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        int databaseSizeBeforeUpdate = transportRepository.findAll().size();

        // Update the transport using partial update
        Transport partialUpdatedTransport = new Transport();
        partialUpdatedTransport.setId(transport.getId());

        partialUpdatedTransport.transportNo(UPDATED_TRANSPORT_NO).regsNo(UPDATED_REGS_NO).type(UPDATED_TYPE);

        restTransportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransport.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransport))
            )
            .andExpect(status().isOk());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
        Transport testTransport = transportList.get(transportList.size() - 1);
        assertThat(testTransport.getTransportNo()).isEqualTo(UPDATED_TRANSPORT_NO);
        assertThat(testTransport.getRegsNo()).isEqualTo(UPDATED_REGS_NO);
        assertThat(testTransport.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingTransport() throws Exception {
        int databaseSizeBeforeUpdate = transportRepository.findAll().size();
        transport.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, transport.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTransport() throws Exception {
        int databaseSizeBeforeUpdate = transportRepository.findAll().size();
        transport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTransport() throws Exception {
        int databaseSizeBeforeUpdate = transportRepository.findAll().size();
        transport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransportMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(transport))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTransport() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        int databaseSizeBeforeDelete = transportRepository.findAll().size();

        // Delete the transport
        restTransportMockMvc
            .perform(delete(ENTITY_API_URL_ID, transport.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
