package vdt.se.nda.elibrary.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A WaitlistItem.
 */
@Entity
@Table(name = "waitlist_item")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WaitlistItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "timestamp")
    private Instant timestamp;

    @ManyToOne
    @JsonIgnoreProperties(value = { "category", "authors", "waitlists", "copies" }, allowSetters = true)
    private Book book;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private PatronAccount patron;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public WaitlistItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public WaitlistItem timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Book getBook() {
        return this.book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public WaitlistItem book(Book book) {
        this.setBook(book);
        return this;
    }

    public PatronAccount getPatron() {
        return this.patron;
    }

    public void setPatron(PatronAccount patronAccount) {
        this.patron = patronAccount;
    }

    public WaitlistItem patron(PatronAccount patronAccount) {
        this.setPatron(patronAccount);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WaitlistItem)) {
            return false;
        }
        return id != null && id.equals(((WaitlistItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WaitlistItem{" +
            "id=" + getId() +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
