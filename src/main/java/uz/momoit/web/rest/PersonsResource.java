package uz.momoit.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uz.momoit.domain.Persons;
import uz.momoit.repository.PersonsRepository;
import uz.momoit.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uz.momoit.domain.Persons}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PersonsResource {

    private final Logger log = LoggerFactory.getLogger(PersonsResource.class);

    private static final String ENTITY_NAME = "persons";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonsRepository personsRepository;

    public PersonsResource(PersonsRepository personsRepository) {
        this.personsRepository = personsRepository;
    }

    /**
     * {@code POST  /persons} : Create a new persons.
     *
     * @param persons the persons to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new persons, or with status {@code 400 (Bad Request)} if the persons has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/persons")
    public ResponseEntity<Persons> createPersons(@RequestBody Persons persons) throws URISyntaxException {
        log.debug("REST request to save Persons : {}", persons);
        if (persons.getId() != null) {
            throw new BadRequestAlertException("A new persons cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Persons result = personsRepository.save(persons);
        return ResponseEntity
            .created(new URI("/api/persons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /persons/:id} : Updates an existing persons.
     *
     * @param id the id of the persons to save.
     * @param persons the persons to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated persons,
     * or with status {@code 400 (Bad Request)} if the persons is not valid,
     * or with status {@code 500 (Internal Server Error)} if the persons couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/persons/{id}")
    public ResponseEntity<Persons> updatePersons(@PathVariable(value = "id", required = false) final Long id, @RequestBody Persons persons)
        throws URISyntaxException {
        log.debug("REST request to update Persons : {}, {}", id, persons);
        if (persons.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, persons.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Persons result = personsRepository.save(persons);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, persons.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /persons/:id} : Partial updates given fields of an existing persons, field will ignore if it is null
     *
     * @param id the id of the persons to save.
     * @param persons the persons to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated persons,
     * or with status {@code 400 (Bad Request)} if the persons is not valid,
     * or with status {@code 404 (Not Found)} if the persons is not found,
     * or with status {@code 500 (Internal Server Error)} if the persons couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/persons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Persons> partialUpdatePersons(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Persons persons
    ) throws URISyntaxException {
        log.debug("REST request to partial update Persons partially : {}, {}", id, persons);
        if (persons.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, persons.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Persons> result = personsRepository
            .findById(persons.getId())
            .map(existingPersons -> {
                if (persons.getName() != null) {
                    existingPersons.setName(persons.getName());
                }
                if (persons.getMobilePhone() != null) {
                    existingPersons.setMobilePhone(persons.getMobilePhone());
                }

                return existingPersons;
            })
            .map(personsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, persons.getId().toString())
        );
    }

    /**
     * {@code GET  /persons} : get all the persons.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of persons in body.
     */
    @GetMapping("/persons")
    public List<Persons> getAllPersons() {
        log.debug("REST request to get all Persons");
        return personsRepository.findAll();
    }

    /**
     * {@code GET  /persons/:id} : get the "id" persons.
     *
     * @param id the id of the persons to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the persons, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/persons/{id}")
    public ResponseEntity<Persons> getPersons(@PathVariable Long id) {
        log.debug("REST request to get Persons : {}", id);
        Optional<Persons> persons = personsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(persons);
    }

    /**
     * {@code DELETE  /persons/:id} : delete the "id" persons.
     *
     * @param id the id of the persons to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/persons/{id}")
    public ResponseEntity<Void> deletePersons(@PathVariable Long id) {
        log.debug("REST request to delete Persons : {}", id);
        personsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
