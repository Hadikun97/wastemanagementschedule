package com.unimap.wsm5.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.unimap.wsm5.IntegrationTest;
import com.unimap.wsm5.domain.Uwaste;
import com.unimap.wsm5.repository.UwasteRepository;
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
 * Integration tests for the {@link UwasteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UwasteResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NO = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NO = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/uwastes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UwasteRepository uwasteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUwasteMockMvc;

    private Uwaste uwaste;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Uwaste createEntity(EntityManager em) {
        Uwaste uwaste = new Uwaste()
            .description(DEFAULT_DESCRIPTION)
            .name(DEFAULT_NAME)
            .contactNo(DEFAULT_CONTACT_NO)
            .address(DEFAULT_ADDRESS);
        return uwaste;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Uwaste createUpdatedEntity(EntityManager em) {
        Uwaste uwaste = new Uwaste()
            .description(UPDATED_DESCRIPTION)
            .name(UPDATED_NAME)
            .contactNo(UPDATED_CONTACT_NO)
            .address(UPDATED_ADDRESS);
        return uwaste;
    }

    @BeforeEach
    public void initTest() {
        uwaste = createEntity(em);
    }

    @Test
    @Transactional
    void createUwaste() throws Exception {
        int databaseSizeBeforeCreate = uwasteRepository.findAll().size();
        // Create the Uwaste
        restUwasteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(uwaste)))
            .andExpect(status().isCreated());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeCreate + 1);
        Uwaste testUwaste = uwasteList.get(uwasteList.size() - 1);
        assertThat(testUwaste.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testUwaste.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testUwaste.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
        assertThat(testUwaste.getAddress()).isEqualTo(DEFAULT_ADDRESS);
    }

    @Test
    @Transactional
    void createUwasteWithExistingId() throws Exception {
        // Create the Uwaste with an existing ID
        uwaste.setId(1L);

        int databaseSizeBeforeCreate = uwasteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUwasteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(uwaste)))
            .andExpect(status().isBadRequest());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = uwasteRepository.findAll().size();
        // set the field null
        uwaste.setName(null);

        // Create the Uwaste, which fails.

        restUwasteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(uwaste)))
            .andExpect(status().isBadRequest());

        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkContactNoIsRequired() throws Exception {
        int databaseSizeBeforeTest = uwasteRepository.findAll().size();
        // set the field null
        uwaste.setContactNo(null);

        // Create the Uwaste, which fails.

        restUwasteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(uwaste)))
            .andExpect(status().isBadRequest());

        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = uwasteRepository.findAll().size();
        // set the field null
        uwaste.setAddress(null);

        // Create the Uwaste, which fails.

        restUwasteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(uwaste)))
            .andExpect(status().isBadRequest());

        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUwastes() throws Exception {
        // Initialize the database
        uwasteRepository.saveAndFlush(uwaste);

        // Get all the uwasteList
        restUwasteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(uwaste.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].contactNo").value(hasItem(DEFAULT_CONTACT_NO)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)));
    }

    @Test
    @Transactional
    void getUwaste() throws Exception {
        // Initialize the database
        uwasteRepository.saveAndFlush(uwaste);

        // Get the uwaste
        restUwasteMockMvc
            .perform(get(ENTITY_API_URL_ID, uwaste.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(uwaste.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.contactNo").value(DEFAULT_CONTACT_NO))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS));
    }

    @Test
    @Transactional
    void getNonExistingUwaste() throws Exception {
        // Get the uwaste
        restUwasteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUwaste() throws Exception {
        // Initialize the database
        uwasteRepository.saveAndFlush(uwaste);

        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();

        // Update the uwaste
        Uwaste updatedUwaste = uwasteRepository.findById(uwaste.getId()).get();
        // Disconnect from session so that the updates on updatedUwaste are not directly saved in db
        em.detach(updatedUwaste);
        updatedUwaste.description(UPDATED_DESCRIPTION).name(UPDATED_NAME).contactNo(UPDATED_CONTACT_NO).address(UPDATED_ADDRESS);

        restUwasteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUwaste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUwaste))
            )
            .andExpect(status().isOk());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
        Uwaste testUwaste = uwasteList.get(uwasteList.size() - 1);
        assertThat(testUwaste.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUwaste.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUwaste.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
        assertThat(testUwaste.getAddress()).isEqualTo(UPDATED_ADDRESS);
    }

    @Test
    @Transactional
    void putNonExistingUwaste() throws Exception {
        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();
        uwaste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUwasteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, uwaste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(uwaste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUwaste() throws Exception {
        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();
        uwaste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUwasteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(uwaste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUwaste() throws Exception {
        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();
        uwaste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUwasteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(uwaste)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUwasteWithPatch() throws Exception {
        // Initialize the database
        uwasteRepository.saveAndFlush(uwaste);

        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();

        // Update the uwaste using partial update
        Uwaste partialUpdatedUwaste = new Uwaste();
        partialUpdatedUwaste.setId(uwaste.getId());

        partialUpdatedUwaste.description(UPDATED_DESCRIPTION);

        restUwasteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUwaste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUwaste))
            )
            .andExpect(status().isOk());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
        Uwaste testUwaste = uwasteList.get(uwasteList.size() - 1);
        assertThat(testUwaste.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUwaste.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testUwaste.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
        assertThat(testUwaste.getAddress()).isEqualTo(DEFAULT_ADDRESS);
    }

    @Test
    @Transactional
    void fullUpdateUwasteWithPatch() throws Exception {
        // Initialize the database
        uwasteRepository.saveAndFlush(uwaste);

        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();

        // Update the uwaste using partial update
        Uwaste partialUpdatedUwaste = new Uwaste();
        partialUpdatedUwaste.setId(uwaste.getId());

        partialUpdatedUwaste.description(UPDATED_DESCRIPTION).name(UPDATED_NAME).contactNo(UPDATED_CONTACT_NO).address(UPDATED_ADDRESS);

        restUwasteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUwaste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUwaste))
            )
            .andExpect(status().isOk());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
        Uwaste testUwaste = uwasteList.get(uwasteList.size() - 1);
        assertThat(testUwaste.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUwaste.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUwaste.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
        assertThat(testUwaste.getAddress()).isEqualTo(UPDATED_ADDRESS);
    }

    @Test
    @Transactional
    void patchNonExistingUwaste() throws Exception {
        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();
        uwaste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUwasteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, uwaste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(uwaste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUwaste() throws Exception {
        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();
        uwaste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUwasteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(uwaste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUwaste() throws Exception {
        int databaseSizeBeforeUpdate = uwasteRepository.findAll().size();
        uwaste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUwasteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(uwaste)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Uwaste in the database
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUwaste() throws Exception {
        // Initialize the database
        uwasteRepository.saveAndFlush(uwaste);

        int databaseSizeBeforeDelete = uwasteRepository.findAll().size();

        // Delete the uwaste
        restUwasteMockMvc
            .perform(delete(ENTITY_API_URL_ID, uwaste.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Uwaste> uwasteList = uwasteRepository.findAll();
        assertThat(uwasteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
