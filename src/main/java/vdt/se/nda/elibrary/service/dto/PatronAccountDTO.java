package vdt.se.nda.elibrary.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;
import vdt.se.nda.elibrary.domain.enumeration.PatronStatus;

/**
 * A DTO for the {@link vdt.se.nda.elibrary.domain.PatronAccount} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PatronAccountDTO implements Serializable {

    @NotNull
    @Size(max = 10)
    private String cardNumber;

    @NotNull
    @Size(max = 255)
    private String firstName;

    @NotNull
    @Size(max = 255)
    private String surname;

    @NotNull
    @Size(max = 255)
    private String email;

    private PatronStatus status;

    private UserDTO user;

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public PatronStatus getStatus() {
        return status;
    }

    public void setStatus(PatronStatus status) {
        this.status = status;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PatronAccountDTO)) {
            return false;
        }

        PatronAccountDTO patronAccountDTO = (PatronAccountDTO) o;
        if (this.cardNumber == null) {
            return false;
        }
        return Objects.equals(this.cardNumber, patronAccountDTO.cardNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.cardNumber);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PatronAccountDTO{" +
            "cardNumber='" + getCardNumber() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", surname='" + getSurname() + "'" +
            ", email='" + getEmail() + "'" +
            ", status='" + getStatus() + "'" +
            ", user=" + getUser() +
            "}";
    }
}
