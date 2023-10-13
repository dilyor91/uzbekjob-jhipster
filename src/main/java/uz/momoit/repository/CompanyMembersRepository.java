package uz.momoit.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uz.momoit.domain.CompanyMembers;

/**
 * Spring Data JPA repository for the CompanyMembers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyMembersRepository extends JpaRepository<CompanyMembers, Long> {}
