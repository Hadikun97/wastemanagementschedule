package com.unimap.wsm5.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.unimap.wsm5.IntegrationTest;
import com.unimap.wsm5.domain.Bulletin;
import com.unimap.wsm5.repository.BulletinRepository;
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
 * Integration tests for the {@link BulletinResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BulletinResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NO = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bulletins";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BulletinRepository bulletinRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBulletinMockMvc;

    private Bulletin bulletin;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bulletin createEntity(EntityManager em) {
        Bulletin bulletin = new Bulletin()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .name(DEFAULT_NAME)
            .contactNo(DEFAULT_CONTACT_NO);
        return bulletin;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bulletin createUpdatedEntity(EntityManager em) {
        Bulletin bulletin = new Bulletin()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .name(UPDATED_NAME)
            .contactNo(UPDATED_CONTACT_NO);
        return bulletin;
    }

    @BeforeEach
    public void initTest() {
        bulletin = createEntity(em);
    }

    @Test
    @Transactional
    void createBulletin() throws Exception {
        int databaseSizeBeforeCreate = bulletinRepository.findAll().size();
        // Create the Bulletin
        restBulletinMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isCreated());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeCreate + 1);
        Bulletin testBulletin = bulletinList.get(bulletinList.size() - 1);
        assertThat(testBulletin.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBulletin.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBulletin.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBulletin.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
    }

    @Test
    @Transactional
    void createBulletinWithExistingId() throws Exception {
        // Create the Bulletin with an existing ID
        bulletin.setId(1L);

        int databaseSizeBeforeCreate = bulletinRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBulletinMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isBadRequest());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = bulletinRepository.findAll().size();
        // set the field null
        bulletin.setTitle(null);

        // Create the Bulletin, which fails.

        restBulletinMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isBadRequest());

        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = bulletinRepository.findAll().size();
        // set the field null
        bulletin.setDescription(null);

        // Create the Bulletin, which fails.

        restBulletinMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isBadRequest());

        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = bulletinRepository.findAll().size();
        // set the field null
        bulletin.setName(null);

        // Create the Bulletin, which fails.

        restBulletinMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isBadRequest());

        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkContactNoIsRequired() throws Exception {
        int databaseSizeBeforeTest = bulletinRepository.findAll().size();
        // set the field null
        bulletin.setContactNo(null);

        // Create the Bulletin, which fails.

        restBulletinMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isBadRequest());

        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBulletins() throws Exception {
        // Initialize the database
        bulletinRepository.saveAndFlush(bulletin);

        // Get all the bulletinList
        restBulletinMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bulletin.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].contactNo").value(hasItem(DEFAULT_CONTACT_NO)));
    }

    @Test
    @Transactional
    void getBulletin() throws Exception {
        // Initialize the database
        bulletinRepository.saveAndFlush(bulletin);

        // Get the bulletin
        restBulletinMockMvc
            .perform(get(ENTITY_API_URL_ID, bulletin.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bulletin.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.contactNo").value(DEFAULT_CONTACT_NO));
    }

    @Test
    @Transactional
    void getNonExistingBulletin() throws Exception {
        // Get the bulletin
        restBulletinMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBulletin() throws Exception {
        // Initialize the database
        bulletinRepository.saveAndFlush(bulletin);

        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();

        // Update the bulletin
        Bulletin updatedBulletin = bulletinRepository.findById(bulletin.getId()).get();
        // Disconnect from session so that the updates on updatedBulletin are not directly saved in db
        em.detach(updatedBulletin);
        updatedBulletin.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).name(UPDATED_NAME).contactNo(UPDATED_CONTACT_NO);

        restBulletinMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBulletin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBulletin))
            )
            .andExpect(status().isOk());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
        Bulletin testBulletin = bulletinList.get(bulletinList.size() - 1);
        assertThat(testBulletin.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBulletin.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBulletin.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBulletin.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
    }

    @Test
    @Transactional
    void putNonExistingBulletin() throws Exception {
        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();
        bulletin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBulletinMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bulletin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bulletin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBulletin() throws Exception {
        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();
        bulletin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulletinMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bulletin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBulletin() throws Exception {
        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();
        bulletin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulletinMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBulletinWithPatch() throws Exception {
        // Initialize the database
        bulletinRepository.saveAndFlush(bulletin);

        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();

        // Update the bulletin using partial update
        Bulletin partialUpdatedBulletin = new Bulletin();
        partialUpdatedBulletin.setId(bulletin.getId());

        partialUpdatedBulletin.name(UPDATED_NAME);

        restBulletinMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBulletin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBulletin))
            )
            .andExpect(status().isOk());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
        Bulletin testBulletin = bulletinList.get(bulletinList.size() - 1);
        assertThat(testBulletin.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBulletin.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBulletin.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBulletin.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
    }

    @Test
    @Transactional
    void fullUpdateBulletinWithPatch() throws Exception {
        // Initialize the database
        bulletinRepository.saveAndFlush(bulletin);

        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();

        // Update the bulletin using partial update
        Bulletin partialUpdatedBulletin = new Bulletin();
        partialUpdatedBulletin.setId(bulletin.getId());

        partialUpdatedBulletin.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).name(UPDATED_NAME).contactNo(UPDATED_CONTACT_NO);

        restBulletinMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBulletin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBulletin))
            )
            .andExpect(status().isOk());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
        Bulletin testBulletin = bulletinList.get(bulletinList.size() - 1);
        assertThat(testBulletin.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBulletin.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBulletin.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBulletin.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
    }

    @Test
    @Transactional
    void patchNonExistingBulletin() throws Exception {
        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();
        bulletin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBulletinMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bulletin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bulletin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBulletin() throws Exception {
        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();
        bulletin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulletinMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bulletin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBulletin() throws Exception {
        int databaseSizeBeforeUpdate = bulletinRepository.findAll().size();
        bulletin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBulletinMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bulletin)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bulletin in the database
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBulletin() throws Exception {
        // Initialize the database
        bulletinRepository.saveAndFlush(bulletin);

        int databaseSizeBeforeDelete = bulletinRepository.findAll().size();

        // Delete the bulletin
        restBulletinMockMvc
            .perform(delete(ENTITY_API_URL_ID, bulletin.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bulletin> bulletinList = bulletinRepository.findAll();
        assertThat(bulletinList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
