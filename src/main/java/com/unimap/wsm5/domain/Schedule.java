package com.unimap.wsm5.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.unimap.wsm5.domain.enumeration.Activities;
import com.unimap.wsm5.domain.enumeration.Days;
import com.unimap.wsm5.domain.enumeration.States;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Schedule.
 */
@Entity
@Table(name = "schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Schedule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "area", length = 100, nullable = false, unique = true)
    private String area;

    @NotNull
    @Size(max = 100)
    @Column(name = "region", length = 100, nullable = false, unique = true)
    private String region;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private States state;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity")
    private Activities activity;

    @Column(name = "date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "day")
    private Days day;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "staff", "transport" }, allowSetters = true)
    private OnDuty onDuty;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Schedule id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArea() {
        return this.area;
    }

    public Schedule area(String area) {
        this.setArea(area);
        return this;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getRegion() {
        return this.region;
    }

    public Schedule region(String region) {
        this.setRegion(region);
        return this;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public States getState() {
        return this.state;
    }

    public Schedule state(States state) {
        this.setState(state);
        return this;
    }

    public void setState(States state) {
        this.state = state;
    }

    public Activities getActivity() {
        return this.activity;
    }

    public Schedule activity(Activities activity) {
        this.setActivity(activity);
        return this;
    }

    public void setActivity(Activities activity) {
        this.activity = activity;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Schedule date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Days getDay() {
        return this.day;
    }

    public Schedule day(Days day) {
        this.setDay(day);
        return this;
    }

    public void setDay(Days day) {
        this.day = day;
    }

    public OnDuty getOnDuty() {
        return this.onDuty;
    }

    public void setOnDuty(OnDuty onDuty) {
        this.onDuty = onDuty;
    }

    public Schedule onDuty(OnDuty onDuty) {
        this.setOnDuty(onDuty);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Schedule)) {
            return false;
        }
        return id != null && id.equals(((Schedule) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Schedule{" +
            "id=" + getId() +
            ", area='" + getArea() + "'" +
            ", region='" + getRegion() + "'" +
            ", state='" + getState() + "'" +
            ", activity='" + getActivity() + "'" +
            ", date='" + getDate() + "'" +
            ", day='" + getDay() + "'" +
            "}";
    }
}
