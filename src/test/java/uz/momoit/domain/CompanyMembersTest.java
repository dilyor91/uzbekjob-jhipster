package uz.momoit.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uz.momoit.web.rest.TestUtil;

class CompanyMembersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompanyMembers.class);
        CompanyMembers companyMembers1 = new CompanyMembers();
        companyMembers1.setId(1L);
        CompanyMembers companyMembers2 = new CompanyMembers();
        companyMembers2.setId(companyMembers1.getId());
        assertThat(companyMembers1).isEqualTo(companyMembers2);
        companyMembers2.setId(2L);
        assertThat(companyMembers1).isNotEqualTo(companyMembers2);
        companyMembers1.setId(null);
        assertThat(companyMembers1).isNotEqualTo(companyMembers2);
    }
}
