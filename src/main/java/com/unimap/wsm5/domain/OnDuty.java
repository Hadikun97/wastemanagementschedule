package com.unimap.wsm5.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OnDuty.
 */
@Entity
@Table(name = "on_duty")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OnDuty implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "duty_no")
    private String dutyNo;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Staff staff;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Transport transport;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OnDuty id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDutyNo() {
        return this.dutyNo;
    }

    public OnDuty dutyNo(String dutyNo) {
        this.setDutyNo(dutyNo);
        return this;
    }

    public void setDutyNo(String dutyNo) {
        this.dutyNo = dutyNo;
    }

    public Staff getStaff() {
        return this.staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public OnDuty staff(Staff staff) {
        this.setStaff(staff);
        return this;
    }

    public Transport getTransport() {
        return this.transport;
    }

    public void setTransport(Transport transport) {
        this.transport = transport;
    }

    public OnDuty transport(Transport transport) {
        this.setTransport(transport);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OnDuty)) {
            return false;
        }
        return id != null && id.equals(((OnDuty) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OnDuty{" +
            "id=" + getId() +
            ", dutyNo='" + getDutyNo() + "'" +
            "}";
    }
}
