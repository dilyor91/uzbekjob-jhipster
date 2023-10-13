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
import uz.momoit.domain.Persons;
import uz.momoit.repository.PersonsRepository;

/**
 * Integration tests for the {@link PersonsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PersonsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MOBILE_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_MOBILE_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/persons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PersonsRepository personsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPersonsMockMvc;

    private Persons persons;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Persons createEntity(EntityManager em) {
        Persons persons = new Persons().name(DEFAULT_NAME).mobilePhone(DEFAULT_MOBILE_PHONE);
        return persons;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Persons createUpdatedEntity(EntityManager em) {
        Persons persons = new Persons().name(UPDATED_NAME).mobilePhone(UPDATED_MOBILE_PHONE);
        return persons;
    }

    @BeforeEach
    public void initTest() {
        persons = createEntity(em);
    }

    @Test
    @Transactional
    void createPersons() throws Exception {
        int databaseSizeBeforeCreate = personsRepository.findAll().size();
        // Create the Persons
        restPersonsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(persons)))
            .andExpect(status().isCreated());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeCreate + 1);
        Persons testPersons = personsList.get(personsList.size() - 1);
        assertThat(testPersons.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPersons.getMobilePhone()).isEqualTo(DEFAULT_MOBILE_PHONE);
    }

    @Test
    @Transactional
    void createPersonsWithExistingId() throws Exception {
        // Create the Persons with an existing ID
        persons.setId(1L);

        int databaseSizeBeforeCreate = personsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPersonsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(persons)))
            .andExpect(status().isBadRequest());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPersons() throws Exception {
        // Initialize the database
        personsRepository.saveAndFlush(persons);

        // Get all the personsList
        restPersonsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(persons.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].mobilePhone").value(hasItem(DEFAULT_MOBILE_PHONE)));
    }

    @Test
    @Transactional
    void getPersons() throws Exception {
        // Initialize the database
        personsRepository.saveAndFlush(persons);

        // Get the persons
        restPersonsMockMvc
            .perform(get(ENTITY_API_URL_ID, persons.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(persons.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.mobilePhone").value(DEFAULT_MOBILE_PHONE));
    }

    @Test
    @Transactional
    void getNonExistingPersons() throws Exception {
        // Get the persons
        restPersonsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPersons() throws Exception {
        // Initialize the database
        personsRepository.saveAndFlush(persons);

        int databaseSizeBeforeUpdate = personsRepository.findAll().size();

        // Update the persons
        Persons updatedPersons = personsRepository.findById(persons.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPersons are not directly saved in db
        em.detach(updatedPersons);
        updatedPersons.name(UPDATED_NAME).mobilePhone(UPDATED_MOBILE_PHONE);

        restPersonsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPersons.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPersons))
            )
            .andExpect(status().isOk());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
        Persons testPersons = personsList.get(personsList.size() - 1);
        assertThat(testPersons.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPersons.getMobilePhone()).isEqualTo(UPDATED_MOBILE_PHONE);
    }

    @Test
    @Transactional
    void putNonExistingPersons() throws Exception {
        int databaseSizeBeforeUpdate = personsRepository.findAll().size();
        persons.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, persons.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(persons))
            )
            .andExpect(status().isBadRequest());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPersons() throws Exception {
        int databaseSizeBeforeUpdate = personsRepository.findAll().size();
        persons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(persons))
            )
            .andExpect(status().isBadRequest());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPersons() throws Exception {
        int databaseSizeBeforeUpdate = personsRepository.findAll().size();
        persons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(persons)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePersonsWithPatch() throws Exception {
        // Initialize the database
        personsRepository.saveAndFlush(persons);

        int databaseSizeBeforeUpdate = personsRepository.findAll().size();

        // Update the persons using partial update
        Persons partialUpdatedPersons = new Persons();
        partialUpdatedPersons.setId(persons.getId());

        partialUpdatedPersons.name(UPDATED_NAME);

        restPersonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersons.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersons))
            )
            .andExpect(status().isOk());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
        Persons testPersons = personsList.get(personsList.size() - 1);
        assertThat(testPersons.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPersons.getMobilePhone()).isEqualTo(DEFAULT_MOBILE_PHONE);
    }

    @Test
    @Transactional
    void fullUpdatePersonsWithPatch() throws Exception {
        // Initialize the database
        personsRepository.saveAndFlush(persons);

        int databaseSizeBeforeUpdate = personsRepository.findAll().size();

        // Update the persons using partial update
        Persons partialUpdatedPersons = new Persons();
        partialUpdatedPersons.setId(persons.getId());

        partialUpdatedPersons.name(UPDATED_NAME).mobilePhone(UPDATED_MOBILE_PHONE);

        restPersonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersons.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersons))
            )
            .andExpect(status().isOk());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
        Persons testPersons = personsList.get(personsList.size() - 1);
        assertThat(testPersons.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPersons.getMobilePhone()).isEqualTo(UPDATED_MOBILE_PHONE);
    }

    @Test
    @Transactional
    void patchNonExistingPersons() throws Exception {
        int databaseSizeBeforeUpdate = personsRepository.findAll().size();
        persons.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, persons.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(persons))
            )
            .andExpect(status().isBadRequest());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPersons() throws Exception {
        int databaseSizeBeforeUpdate = personsRepository.findAll().size();
        persons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(persons))
            )
            .andExpect(status().isBadRequest());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPersons() throws Exception {
        int databaseSizeBeforeUpdate = personsRepository.findAll().size();
        persons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(persons)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Persons in the database
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePersons() throws Exception {
        // Initialize the database
        personsRepository.saveAndFlush(persons);

        int databaseSizeBeforeDelete = personsRepository.findAll().size();

        // Delete the persons
        restPersonsMockMvc
            .perform(delete(ENTITY_API_URL_ID, persons.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Persons> personsList = personsRepository.findAll();
        assertThat(personsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
