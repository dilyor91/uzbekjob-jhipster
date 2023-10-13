package uz.momoit.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uz.momoit.domain.Persons;

/**
 * Spring Data JPA repository for the Persons entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PersonsRepository extends JpaRepository<Persons, Long> {}
