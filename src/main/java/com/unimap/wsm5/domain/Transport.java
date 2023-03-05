package com.unimap.wsm5.domain;

import com.unimap.wsm5.domain.enumeration.Types;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Transport.
 */
@Entity
@Table(name = "transport")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Transport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "transport_no", unique = true)
    private String transportNo;

    @Column(name = "regs_no", unique = true)
    private String regsNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private Types type;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Transport id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransportNo() {
        return this.transportNo;
    }

    public Transport transportNo(String transportNo) {
        this.setTransportNo(transportNo);
        return this;
    }

    public void setTransportNo(String transportNo) {
        this.transportNo = transportNo;
    }

    public String getRegsNo() {
        return this.regsNo;
    }

    public Transport regsNo(String regsNo) {
        this.setRegsNo(regsNo);
        return this;
    }

    public void setRegsNo(String regsNo) {
        this.regsNo = regsNo;
    }

    public Types getType() {
        return this.type;
    }

    public Transport type(Types type) {
        this.setType(type);
        return this;
    }

    public void setType(Types type) {
        this.type = type;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transport)) {
            return false;
        }
        return id != null && id.equals(((Transport) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transport{" +
            "id=" + getId() +
            ", transportNo='" + getTransportNo() + "'" +
            ", regsNo='" + getRegsNo() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
