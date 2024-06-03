package vdt.se.nda.elibrary.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link vdt.se.nda.elibrary.domain.WaitlistItem} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WaitlistItemDTO implements Serializable {

    private Long id;

    private Instant timestamp;

    private BookDTO book;

    private PatronAccountDTO patron;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public BookDTO getBook() {
        return book;
    }

    public void setBook(BookDTO book) {
        this.book = book;
    }

    public PatronAccountDTO getPatron() {
        return patron;
    }

    public void setPatron(PatronAccountDTO patron) {
        this.patron = patron;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WaitlistItemDTO)) {
            return false;
        }

        WaitlistItemDTO waitlistItemDTO = (WaitlistItemDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, waitlistItemDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WaitlistItemDTO{" +
            "id=" + getId() +
            ", timestamp='" + getTimestamp() + "'" +
            ", book=" + getBook() +
            ", patron=" + getPatron() +
            "}";
    }
}
