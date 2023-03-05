package com.unimap.wsm5.domain;

import com.unimap.wsm5.domain.enumeration.Gender;
import com.unimap.wsm5.domain.enumeration.License;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Staff.
 */
@Entity
@Table(name = "staff")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Staff implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 10)
    @Column(name = "reg_no", length = 10, unique = true)
    private String regNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "license")
    private License license;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @NotNull
    @Size(max = 100)
    @Column(name = "address", length = 100, nullable = false)
    private String address;

    @NotNull
    @Size(max = 20)
    @Column(name = "contact_no", length = 20, nullable = false)
    private String contactNo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Staff id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegNo() {
        return this.regNo;
    }

    public Staff regNo(String regNo) {
        this.setRegNo(regNo);
        return this;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }

    public License getLicense() {
        return this.license;
    }

    public Staff license(License license) {
        this.setLicense(license);
        return this;
    }

    public void setLicense(License license) {
        this.license = license;
    }

    public Gender getGender() {
        return this.gender;
    }

    public Staff gender(Gender gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getName() {
        return this.name;
    }

    public Staff name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return this.address;
    }

    public Staff address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactNo() {
        return this.contactNo;
    }

    public Staff contactNo(String contactNo) {
        this.setContactNo(contactNo);
        return this;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Staff)) {
            return false;
        }
        return id != null && id.equals(((Staff) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Staff{" +
            "id=" + getId() +
            ", regNo='" + getRegNo() + "'" +
            ", license='" + getLicense() + "'" +
            ", gender='" + getGender() + "'" +
            ", name='" + getName() + "'" +
            ", address='" + getAddress() + "'" +
            ", contactNo='" + getContactNo() + "'" +
            "}";
    }
}
