package com.unimap.wsm5.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.unimap.wsm5.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UwasteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Uwaste.class);
        Uwaste uwaste1 = new Uwaste();
        uwaste1.setId(1L);
        Uwaste uwaste2 = new Uwaste();
        uwaste2.setId(uwaste1.getId());
        assertThat(uwaste1).isEqualTo(uwaste2);
        uwaste2.setId(2L);
        assertThat(uwaste1).isNotEqualTo(uwaste2);
        uwaste1.setId(null);
        assertThat(uwaste1).isNotEqualTo(uwaste2);
    }
}
