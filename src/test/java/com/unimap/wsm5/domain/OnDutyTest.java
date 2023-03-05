package com.unimap.wsm5.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.unimap.wsm5.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OnDutyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OnDuty.class);
        OnDuty onDuty1 = new OnDuty();
        onDuty1.setId(1L);
        OnDuty onDuty2 = new OnDuty();
        onDuty2.setId(onDuty1.getId());
        assertThat(onDuty1).isEqualTo(onDuty2);
        onDuty2.setId(2L);
        assertThat(onDuty1).isNotEqualTo(onDuty2);
        onDuty1.setId(null);
        assertThat(onDuty1).isNotEqualTo(onDuty2);
    }
}
