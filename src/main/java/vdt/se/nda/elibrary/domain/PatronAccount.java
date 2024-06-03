package vdt.se.nda.elibrary.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.springframework.data.domain.Persistable;
import vdt.se.nda.elibrary.domain.enumeration.PatronStatus;

/**
 * A PatronAccount.
 */
@JsonIgnoreProperties(value = { "new" })
@Entity
@Table(name = "patron_account")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PatronAccount implements Serializable, Persistable<String> {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Size(max = 10)
    @Id
    @Column(name = "card_number", length = 10, nullable = false, unique = true)
    private String cardNumber;

    @NotNull
    @Size(max = 255)
    @Column(name = "first_name", length = 255, nullable = false)
    private String firstName;

    @NotNull
    @Size(max = 255)
    @Column(name = "surname", length = 255, nullable = false)
    private String surname;

    @NotNull
    @Size(max = 255)
    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PatronStatus status;

    @Transient
    private boolean isPersisted;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getCardNumber() {
        return this.cardNumber;
    }

    public PatronAccount cardNumber(String cardNumber) {
        this.setCardNumber(cardNumber);
        return this;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public PatronAccount firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSurname() {
        return this.surname;
    }

    public PatronAccount surname(String surname) {
        this.setSurname(surname);
        return this;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return this.email;
    }

    public PatronAccount email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public PatronStatus getStatus() {
        return this.status;
    }

    public PatronAccount status(PatronStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(PatronStatus status) {
        this.status = status;
    }

    @Override
    public String getId() {
        return this.cardNumber;
    }

    @Transient
    @Override
    public boolean isNew() {
        return !this.isPersisted;
    }

    public PatronAccount setIsPersisted() {
        this.isPersisted = true;
        return this;
    }

    @PostLoad
    @PostPersist
    public void updateEntityState() {
        this.setIsPersisted();
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PatronAccount user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PatronAccount)) {
            return false;
        }
        return cardNumber != null && cardNumber.equals(((PatronAccount) o).cardNumber);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PatronAccount{" +
            "cardNumber=" + getCardNumber() +
            ", firstName='" + getFirstName() + "'" +
            ", surname='" + getSurname() + "'" +
            ", email='" + getEmail() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
