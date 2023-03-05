package com.unimap.wsm5.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.unimap.wsm5.IntegrationTest;
import com.unimap.wsm5.domain.Staff;
import com.unimap.wsm5.domain.enumeration.Gender;
import com.unimap.wsm5.domain.enumeration.License;
import com.unimap.wsm5.repository.StaffRepository;
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
 * Integration tests for the {@link StaffResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StaffResourceIT {

    private static final String DEFAULT_REG_NO = "AAAAAAAAAA";
    private static final String UPDATED_REG_NO = "BBBBBBBBBB";

    private static final License DEFAULT_LICENSE = License.Yes;
    private static final License UPDATED_LICENSE = License.No;

    private static final Gender DEFAULT_GENDER = Gender.Male;
    private static final Gender UPDATED_GENDER = Gender.Female;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NO = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/staff";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStaffMockMvc;

    private Staff staff;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Staff createEntity(EntityManager em) {
        Staff staff = new Staff()
            .regNo(DEFAULT_REG_NO)
            .license(DEFAULT_LICENSE)
            .gender(DEFAULT_GENDER)
            .name(DEFAULT_NAME)
            .address(DEFAULT_ADDRESS)
            .contactNo(DEFAULT_CONTACT_NO);
        return staff;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Staff createUpdatedEntity(EntityManager em) {
        Staff staff = new Staff()
            .regNo(UPDATED_REG_NO)
            .license(UPDATED_LICENSE)
            .gender(UPDATED_GENDER)
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .contactNo(UPDATED_CONTACT_NO);
        return staff;
    }

    @BeforeEach
    public void initTest() {
        staff = createEntity(em);
    }

    @Test
    @Transactional
    void createStaff() throws Exception {
        int databaseSizeBeforeCreate = staffRepository.findAll().size();
        // Create the Staff
        restStaffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(staff)))
            .andExpect(status().isCreated());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeCreate + 1);
        Staff testStaff = staffList.get(staffList.size() - 1);
        assertThat(testStaff.getRegNo()).isEqualTo(DEFAULT_REG_NO);
        assertThat(testStaff.getLicense()).isEqualTo(DEFAULT_LICENSE);
        assertThat(testStaff.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testStaff.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStaff.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testStaff.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
    }

    @Test
    @Transactional
    void createStaffWithExistingId() throws Exception {
        // Create the Staff with an existing ID
        staff.setId(1L);

        int databaseSizeBeforeCreate = staffRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStaffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(staff)))
            .andExpect(status().isBadRequest());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = staffRepository.findAll().size();
        // set the field null
        staff.setName(null);

        // Create the Staff, which fails.

        restStaffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(staff)))
            .andExpect(status().isBadRequest());

        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = staffRepository.findAll().size();
        // set the field null
        staff.setAddress(null);

        // Create the Staff, which fails.

        restStaffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(staff)))
            .andExpect(status().isBadRequest());

        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkContactNoIsRequired() throws Exception {
        int databaseSizeBeforeTest = staffRepository.findAll().size();
        // set the field null
        staff.setContactNo(null);

        // Create the Staff, which fails.

        restStaffMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(staff)))
            .andExpect(status().isBadRequest());

        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStaff() throws Exception {
        // Initialize the database
        staffRepository.saveAndFlush(staff);

        // Get all the staffList
        restStaffMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(staff.getId().intValue())))
            .andExpect(jsonPath("$.[*].regNo").value(hasItem(DEFAULT_REG_NO)))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].contactNo").value(hasItem(DEFAULT_CONTACT_NO)));
    }

    @Test
    @Transactional
    void getStaff() throws Exception {
        // Initialize the database
        staffRepository.saveAndFlush(staff);

        // Get the staff
        restStaffMockMvc
            .perform(get(ENTITY_API_URL_ID, staff.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(staff.getId().intValue()))
            .andExpect(jsonPath("$.regNo").value(DEFAULT_REG_NO))
            .andExpect(jsonPath("$.license").value(DEFAULT_LICENSE.toString()))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.contactNo").value(DEFAULT_CONTACT_NO));
    }

    @Test
    @Transactional
    void getNonExistingStaff() throws Exception {
        // Get the staff
        restStaffMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStaff() throws Exception {
        // Initialize the database
        staffRepository.saveAndFlush(staff);

        int databaseSizeBeforeUpdate = staffRepository.findAll().size();

        // Update the staff
        Staff updatedStaff = staffRepository.findById(staff.getId()).get();
        // Disconnect from session so that the updates on updatedStaff are not directly saved in db
        em.detach(updatedStaff);
        updatedStaff
            .regNo(UPDATED_REG_NO)
            .license(UPDATED_LICENSE)
            .gender(UPDATED_GENDER)
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .contactNo(UPDATED_CONTACT_NO);

        restStaffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStaff.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStaff))
            )
            .andExpect(status().isOk());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
        Staff testStaff = staffList.get(staffList.size() - 1);
        assertThat(testStaff.getRegNo()).isEqualTo(UPDATED_REG_NO);
        assertThat(testStaff.getLicense()).isEqualTo(UPDATED_LICENSE);
        assertThat(testStaff.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testStaff.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStaff.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testStaff.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
    }

    @Test
    @Transactional
    void putNonExistingStaff() throws Exception {
        int databaseSizeBeforeUpdate = staffRepository.findAll().size();
        staff.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStaffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, staff.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(staff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStaff() throws Exception {
        int databaseSizeBeforeUpdate = staffRepository.findAll().size();
        staff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStaffMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(staff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStaff() throws Exception {
        int databaseSizeBeforeUpdate = staffRepository.findAll().size();
        staff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStaffMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(staff)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStaffWithPatch() throws Exception {
        // Initialize the database
        staffRepository.saveAndFlush(staff);

        int databaseSizeBeforeUpdate = staffRepository.findAll().size();

        // Update the staff using partial update
        Staff partialUpdatedStaff = new Staff();
        partialUpdatedStaff.setId(staff.getId());

        partialUpdatedStaff.license(UPDATED_LICENSE).gender(UPDATED_GENDER).address(UPDATED_ADDRESS);

        restStaffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStaff.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStaff))
            )
            .andExpect(status().isOk());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
        Staff testStaff = staffList.get(staffList.size() - 1);
        assertThat(testStaff.getRegNo()).isEqualTo(DEFAULT_REG_NO);
        assertThat(testStaff.getLicense()).isEqualTo(UPDATED_LICENSE);
        assertThat(testStaff.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testStaff.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStaff.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testStaff.getContactNo()).isEqualTo(DEFAULT_CONTACT_NO);
    }

    @Test
    @Transactional
    void fullUpdateStaffWithPatch() throws Exception {
        // Initialize the database
        staffRepository.saveAndFlush(staff);

        int databaseSizeBeforeUpdate = staffRepository.findAll().size();

        // Update the staff using partial update
        Staff partialUpdatedStaff = new Staff();
        partialUpdatedStaff.setId(staff.getId());

        partialUpdatedStaff
            .regNo(UPDATED_REG_NO)
            .license(UPDATED_LICENSE)
            .gender(UPDATED_GENDER)
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .contactNo(UPDATED_CONTACT_NO);

        restStaffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStaff.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStaff))
            )
            .andExpect(status().isOk());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
        Staff testStaff = staffList.get(staffList.size() - 1);
        assertThat(testStaff.getRegNo()).isEqualTo(UPDATED_REG_NO);
        assertThat(testStaff.getLicense()).isEqualTo(UPDATED_LICENSE);
        assertThat(testStaff.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testStaff.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStaff.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testStaff.getContactNo()).isEqualTo(UPDATED_CONTACT_NO);
    }

    @Test
    @Transactional
    void patchNonExistingStaff() throws Exception {
        int databaseSizeBeforeUpdate = staffRepository.findAll().size();
        staff.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStaffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, staff.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(staff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStaff() throws Exception {
        int databaseSizeBeforeUpdate = staffRepository.findAll().size();
        staff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStaffMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(staff))
            )
            .andExpect(status().isBadRequest());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStaff() throws Exception {
        int databaseSizeBeforeUpdate = staffRepository.findAll().size();
        staff.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStaffMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(staff)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Staff in the database
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStaff() throws Exception {
        // Initialize the database
        staffRepository.saveAndFlush(staff);

        int databaseSizeBeforeDelete = staffRepository.findAll().size();

        // Delete the staff
        restStaffMockMvc
            .perform(delete(ENTITY_API_URL_ID, staff.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Staff> staffList = staffRepository.findAll();
        assertThat(staffList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
