package uz.momoit.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uz.momoit.IntegrationTest;
import uz.momoit.domain.CompanyMembers;
import uz.momoit.domain.enumeration.MembersTypeEnum;
import uz.momoit.repository.CompanyMembersRepository;

/**
 * Integration tests for the {@link CompanyMembersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompanyMembersResourceIT {

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_BUSINESS_REG_NUM = "AAAAAAAAAA";
    private static final String UPDATED_BUSINESS_REG_NUM = "BBBBBBBBBB";

    private static final String DEFAULT_REPRESANTITIVE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_REPRESANTITIVE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_SUBSCRIBER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SUBSCRIBER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final MembersTypeEnum DEFAULT_MEMBERS_TYPE = MembersTypeEnum.FIRM_MEMBER;
    private static final MembersTypeEnum UPDATED_MEMBERS_TYPE = MembersTypeEnum.COMPANY_MEMBER;

    private static final String ENTITY_API_URL = "/api/company-members";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompanyMembersRepository companyMembersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompanyMembersMockMvc;

    private CompanyMembers companyMembers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyMembers createEntity(EntityManager em) {
        CompanyMembers companyMembers = new CompanyMembers()
            .companyName(DEFAULT_COMPANY_NAME)
            .businessRegNum(DEFAULT_BUSINESS_REG_NUM)
            .represantitiveName(DEFAULT_REPRESANTITIVE_NAME)
            .companyAddress(DEFAULT_COMPANY_ADDRESS)
            .subscriberName(DEFAULT_SUBSCRIBER_NAME)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .membersType(DEFAULT_MEMBERS_TYPE);
        return companyMembers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyMembers createUpdatedEntity(EntityManager em) {
        CompanyMembers companyMembers = new CompanyMembers()
            .companyName(UPDATED_COMPANY_NAME)
            .businessRegNum(UPDATED_BUSINESS_REG_NUM)
            .represantitiveName(UPDATED_REPRESANTITIVE_NAME)
            .companyAddress(UPDATED_COMPANY_ADDRESS)
            .subscriberName(UPDATED_SUBSCRIBER_NAME)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .membersType(UPDATED_MEMBERS_TYPE);
        return companyMembers;
    }

    @BeforeEach
    public void initTest() {
        companyMembers = createEntity(em);
    }

    @Test
    @Transactional
    void createCompanyMembers() throws Exception {
        int databaseSizeBeforeCreate = companyMembersRepository.findAll().size();
        // Create the CompanyMembers
        restCompanyMembersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyMembers))
            )
            .andExpect(status().isCreated());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeCreate + 1);
        CompanyMembers testCompanyMembers = companyMembersList.get(companyMembersList.size() - 1);
        assertThat(testCompanyMembers.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testCompanyMembers.getBusinessRegNum()).isEqualTo(DEFAULT_BUSINESS_REG_NUM);
        assertThat(testCompanyMembers.getRepresantitiveName()).isEqualTo(DEFAULT_REPRESANTITIVE_NAME);
        assertThat(testCompanyMembers.getCompanyAddress()).isEqualTo(DEFAULT_COMPANY_ADDRESS);
        assertThat(testCompanyMembers.getSubscriberName()).isEqualTo(DEFAULT_SUBSCRIBER_NAME);
        assertThat(testCompanyMembers.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testCompanyMembers.getMembersType()).isEqualTo(DEFAULT_MEMBERS_TYPE);
    }

    @Test
    @Transactional
    void createCompanyMembersWithExistingId() throws Exception {
        // Create the CompanyMembers with an existing ID
        companyMembers.setId(1L);

        int databaseSizeBeforeCreate = companyMembersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanyMembersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyMembers))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompanyMembers() throws Exception {
        // Initialize the database
        companyMembersRepository.saveAndFlush(companyMembers);

        // Get all the companyMembersList
        restCompanyMembersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyMembers.getId().intValue())))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].businessRegNum").value(hasItem(DEFAULT_BUSINESS_REG_NUM)))
            .andExpect(jsonPath("$.[*].represantitiveName").value(hasItem(DEFAULT_REPRESANTITIVE_NAME)))
            .andExpect(jsonPath("$.[*].companyAddress").value(hasItem(DEFAULT_COMPANY_ADDRESS)))
            .andExpect(jsonPath("$.[*].subscriberName").value(hasItem(DEFAULT_SUBSCRIBER_NAME)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].membersType").value(hasItem(DEFAULT_MEMBERS_TYPE.toString())));
    }

    @Test
    @Transactional
    void getCompanyMembers() throws Exception {
        // Initialize the database
        companyMembersRepository.saveAndFlush(companyMembers);

        // Get the companyMembers
        restCompanyMembersMockMvc
            .perform(get(ENTITY_API_URL_ID, companyMembers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(companyMembers.getId().intValue()))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.businessRegNum").value(DEFAULT_BUSINESS_REG_NUM))
            .andExpect(jsonPath("$.represantitiveName").value(DEFAULT_REPRESANTITIVE_NAME))
            .andExpect(jsonPath("$.companyAddress").value(DEFAULT_COMPANY_ADDRESS))
            .andExpect(jsonPath("$.subscriberName").value(DEFAULT_SUBSCRIBER_NAME))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.membersType").value(DEFAULT_MEMBERS_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCompanyMembers() throws Exception {
        // Get the companyMembers
        restCompanyMembersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompanyMembers() throws Exception {
        // Initialize the database
        companyMembersRepository.saveAndFlush(companyMembers);

        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();

        // Update the companyMembers
        CompanyMembers updatedCompanyMembers = companyMembersRepository.findById(companyMembers.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCompanyMembers are not directly saved in db
        em.detach(updatedCompanyMembers);
        updatedCompanyMembers
            .companyName(UPDATED_COMPANY_NAME)
            .businessRegNum(UPDATED_BUSINESS_REG_NUM)
            .represantitiveName(UPDATED_REPRESANTITIVE_NAME)
            .companyAddress(UPDATED_COMPANY_ADDRESS)
            .subscriberName(UPDATED_SUBSCRIBER_NAME)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .membersType(UPDATED_MEMBERS_TYPE);

        restCompanyMembersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompanyMembers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompanyMembers))
            )
            .andExpect(status().isOk());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
        CompanyMembers testCompanyMembers = companyMembersList.get(companyMembersList.size() - 1);
        assertThat(testCompanyMembers.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testCompanyMembers.getBusinessRegNum()).isEqualTo(UPDATED_BUSINESS_REG_NUM);
        assertThat(testCompanyMembers.getRepresantitiveName()).isEqualTo(UPDATED_REPRESANTITIVE_NAME);
        assertThat(testCompanyMembers.getCompanyAddress()).isEqualTo(UPDATED_COMPANY_ADDRESS);
        assertThat(testCompanyMembers.getSubscriberName()).isEqualTo(UPDATED_SUBSCRIBER_NAME);
        assertThat(testCompanyMembers.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testCompanyMembers.getMembersType()).isEqualTo(UPDATED_MEMBERS_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingCompanyMembers() throws Exception {
        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();
        companyMembers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyMembersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, companyMembers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyMembers))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompanyMembers() throws Exception {
        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();
        companyMembers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyMembersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyMembers))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompanyMembers() throws Exception {
        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();
        companyMembers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyMembersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyMembers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompanyMembersWithPatch() throws Exception {
        // Initialize the database
        companyMembersRepository.saveAndFlush(companyMembers);

        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();

        // Update the companyMembers using partial update
        CompanyMembers partialUpdatedCompanyMembers = new CompanyMembers();
        partialUpdatedCompanyMembers.setId(companyMembers.getId());

        partialUpdatedCompanyMembers
            .represantitiveName(UPDATED_REPRESANTITIVE_NAME)
            .companyAddress(UPDATED_COMPANY_ADDRESS)
            .membersType(UPDATED_MEMBERS_TYPE);

        restCompanyMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyMembers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyMembers))
            )
            .andExpect(status().isOk());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
        CompanyMembers testCompanyMembers = companyMembersList.get(companyMembersList.size() - 1);
        assertThat(testCompanyMembers.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testCompanyMembers.getBusinessRegNum()).isEqualTo(DEFAULT_BUSINESS_REG_NUM);
        assertThat(testCompanyMembers.getRepresantitiveName()).isEqualTo(UPDATED_REPRESANTITIVE_NAME);
        assertThat(testCompanyMembers.getCompanyAddress()).isEqualTo(UPDATED_COMPANY_ADDRESS);
        assertThat(testCompanyMembers.getSubscriberName()).isEqualTo(DEFAULT_SUBSCRIBER_NAME);
        assertThat(testCompanyMembers.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testCompanyMembers.getMembersType()).isEqualTo(UPDATED_MEMBERS_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateCompanyMembersWithPatch() throws Exception {
        // Initialize the database
        companyMembersRepository.saveAndFlush(companyMembers);

        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();

        // Update the companyMembers using partial update
        CompanyMembers partialUpdatedCompanyMembers = new CompanyMembers();
        partialUpdatedCompanyMembers.setId(companyMembers.getId());

        partialUpdatedCompanyMembers
            .companyName(UPDATED_COMPANY_NAME)
            .businessRegNum(UPDATED_BUSINESS_REG_NUM)
            .represantitiveName(UPDATED_REPRESANTITIVE_NAME)
            .companyAddress(UPDATED_COMPANY_ADDRESS)
            .subscriberName(UPDATED_SUBSCRIBER_NAME)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .membersType(UPDATED_MEMBERS_TYPE);

        restCompanyMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyMembers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyMembers))
            )
            .andExpect(status().isOk());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
        CompanyMembers testCompanyMembers = companyMembersList.get(companyMembersList.size() - 1);
        assertThat(testCompanyMembers.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testCompanyMembers.getBusinessRegNum()).isEqualTo(UPDATED_BUSINESS_REG_NUM);
        assertThat(testCompanyMembers.getRepresantitiveName()).isEqualTo(UPDATED_REPRESANTITIVE_NAME);
        assertThat(testCompanyMembers.getCompanyAddress()).isEqualTo(UPDATED_COMPANY_ADDRESS);
        assertThat(testCompanyMembers.getSubscriberName()).isEqualTo(UPDATED_SUBSCRIBER_NAME);
        assertThat(testCompanyMembers.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testCompanyMembers.getMembersType()).isEqualTo(UPDATED_MEMBERS_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingCompanyMembers() throws Exception {
        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();
        companyMembers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, companyMembers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyMembers))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompanyMembers() throws Exception {
        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();
        companyMembers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyMembersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyMembers))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompanyMembers() throws Exception {
        int databaseSizeBeforeUpdate = companyMembersRepository.findAll().size();
        companyMembers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyMembersMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(companyMembers))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyMembers in the database
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompanyMembers() throws Exception {
        // Initialize the database
        companyMembersRepository.saveAndFlush(companyMembers);

        int databaseSizeBeforeDelete = companyMembersRepository.findAll().size();

        // Delete the companyMembers
        restCompanyMembersMockMvc
            .perform(delete(ENTITY_API_URL_ID, companyMembers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompanyMembers> companyMembersList = companyMembersRepository.findAll();
        assertThat(companyMembersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
