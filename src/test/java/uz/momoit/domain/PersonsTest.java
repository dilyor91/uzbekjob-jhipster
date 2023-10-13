package uz.momoit.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uz.momoit.web.rest.TestUtil;

class PersonsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Persons.class);
        Persons persons1 = new Persons();
        persons1.setId(1L);
        Persons persons2 = new Persons();
        persons2.setId(persons1.getId());
        assertThat(persons1).isEqualTo(persons2);
        persons2.setId(2L);
        assertThat(persons1).isNotEqualTo(persons2);
        persons1.setId(null);
        assertThat(persons1).isNotEqualTo(persons2);
    }
}
