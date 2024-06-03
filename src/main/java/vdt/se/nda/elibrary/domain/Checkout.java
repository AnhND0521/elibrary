package vdt.se.nda.elibrary.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Checkout.
 */
@Entity
@Table(name = "checkout")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Checkout implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "due_end_time")
    private Instant dueEndTime;

    @Column(name = "is_returned")
    private Boolean isReturned;

    @ManyToOne
    @JsonIgnoreProperties(value = { "book", "publisher", "checkouts", "holds" }, allowSetters = true)
    private BookCopy copy;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private PatronAccount patron;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Checkout id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public Checkout startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public Checkout endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Instant getDueEndTime() {
        return this.dueEndTime;
    }

    public Checkout dueEndTime(Instant dueEndTime) {
        this.setDueEndTime(dueEndTime);
        return this;
    }

    public void setDueEndTime(Instant dueEndTime) {
        this.dueEndTime = dueEndTime;
    }

    public Boolean getIsReturned() {
        return this.isReturned;
    }

    public Checkout isReturned(Boolean isReturned) {
        this.setIsReturned(isReturned);
        return this;
    }

    public void setIsReturned(Boolean isReturned) {
        this.isReturned = isReturned;
    }

    public BookCopy getCopy() {
        return this.copy;
    }

    public void setCopy(BookCopy bookCopy) {
        this.copy = bookCopy;
    }

    public Checkout copy(BookCopy bookCopy) {
        this.setCopy(bookCopy);
        return this;
    }

    public PatronAccount getPatron() {
        return this.patron;
    }

    public void setPatron(PatronAccount patronAccount) {
        this.patron = patronAccount;
    }

    public Checkout patron(PatronAccount patronAccount) {
        this.setPatron(patronAccount);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Checkout)) {
            return false;
        }
        return id != null && id.equals(((Checkout) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Checkout{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", dueEndTime='" + getDueEndTime() + "'" +
            ", isReturned='" + getIsReturned() + "'" +
            "}";
    }
}
