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
import uz.momoit.domain.CompanyMembers;
import uz.momoit.repository.CompanyMembersRepository;
import uz.momoit.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uz.momoit.domain.CompanyMembers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompanyMembersResource {

    private final Logger log = LoggerFactory.getLogger(CompanyMembersResource.class);

    private static final String ENTITY_NAME = "companyMembers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompanyMembersRepository companyMembersRepository;

    public CompanyMembersResource(CompanyMembersRepository companyMembersRepository) {
        this.companyMembersRepository = companyMembersRepository;
    }

    /**
     * {@code POST  /company-members} : Create a new companyMembers.
     *
     * @param companyMembers the companyMembers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new companyMembers, or with status {@code 400 (Bad Request)} if the companyMembers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/company-members")
    public ResponseEntity<CompanyMembers> createCompanyMembers(@RequestBody CompanyMembers companyMembers) throws URISyntaxException {
        log.debug("REST request to save CompanyMembers : {}", companyMembers);
        if (companyMembers.getId() != null) {
            throw new BadRequestAlertException("A new companyMembers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanyMembers result = companyMembersRepository.save(companyMembers);
        return ResponseEntity
            .created(new URI("/api/company-members/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /company-members/:id} : Updates an existing companyMembers.
     *
     * @param id the id of the companyMembers to save.
     * @param companyMembers the companyMembers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyMembers,
     * or with status {@code 400 (Bad Request)} if the companyMembers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the companyMembers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/company-members/{id}")
    public ResponseEntity<CompanyMembers> updateCompanyMembers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompanyMembers companyMembers
    ) throws URISyntaxException {
        log.debug("REST request to update CompanyMembers : {}, {}", id, companyMembers);
        if (companyMembers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyMembers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyMembersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompanyMembers result = companyMembersRepository.save(companyMembers);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, companyMembers.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /company-members/:id} : Partial updates given fields of an existing companyMembers, field will ignore if it is null
     *
     * @param id the id of the companyMembers to save.
     * @param companyMembers the companyMembers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyMembers,
     * or with status {@code 400 (Bad Request)} if the companyMembers is not valid,
     * or with status {@code 404 (Not Found)} if the companyMembers is not found,
     * or with status {@code 500 (Internal Server Error)} if the companyMembers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/company-members/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompanyMembers> partialUpdateCompanyMembers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompanyMembers companyMembers
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompanyMembers partially : {}, {}", id, companyMembers);
        if (companyMembers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyMembers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyMembersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompanyMembers> result = companyMembersRepository
            .findById(companyMembers.getId())
            .map(existingCompanyMembers -> {
                if (companyMembers.getCompanyName() != null) {
                    existingCompanyMembers.setCompanyName(companyMembers.getCompanyName());
                }
                if (companyMembers.getBusinessRegNum() != null) {
                    existingCompanyMembers.setBusinessRegNum(companyMembers.getBusinessRegNum());
                }
                if (companyMembers.getRepresantitiveName() != null) {
                    existingCompanyMembers.setRepresantitiveName(companyMembers.getRepresantitiveName());
                }
                if (companyMembers.getCompanyAddress() != null) {
                    existingCompanyMembers.setCompanyAddress(companyMembers.getCompanyAddress());
                }
                if (companyMembers.getSubscriberName() != null) {
                    existingCompanyMembers.setSubscriberName(companyMembers.getSubscriberName());
                }
                if (companyMembers.getPhoneNumber() != null) {
                    existingCompanyMembers.setPhoneNumber(companyMembers.getPhoneNumber());
                }
                if (companyMembers.getMembersType() != null) {
                    existingCompanyMembers.setMembersType(companyMembers.getMembersType());
                }

                return existingCompanyMembers;
            })
            .map(companyMembersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, companyMembers.getId().toString())
        );
    }

    /**
     * {@code GET  /company-members} : get all the companyMembers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of companyMembers in body.
     */
    @GetMapping("/company-members")
    public List<CompanyMembers> getAllCompanyMembers() {
        log.debug("REST request to get all CompanyMembers");
        return companyMembersRepository.findAll();
    }

    /**
     * {@code GET  /company-members/:id} : get the "id" companyMembers.
     *
     * @param id the id of the companyMembers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the companyMembers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/company-members/{id}")
    public ResponseEntity<CompanyMembers> getCompanyMembers(@PathVariable Long id) {
        log.debug("REST request to get CompanyMembers : {}", id);
        Optional<CompanyMembers> companyMembers = companyMembersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(companyMembers);
    }

    /**
     * {@code DELETE  /company-members/:id} : delete the "id" companyMembers.
     *
     * @param id the id of the companyMembers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/company-members/{id}")
    public ResponseEntity<Void> deleteCompanyMembers(@PathVariable Long id) {
        log.debug("REST request to delete CompanyMembers : {}", id);
        companyMembersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
