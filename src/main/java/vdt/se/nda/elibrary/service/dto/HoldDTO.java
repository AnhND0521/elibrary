package vdt.se.nda.elibrary.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link vdt.se.nda.elibrary.domain.Hold} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HoldDTO implements Serializable {

    private Long id;

    private Instant startTime;

    private Instant endTime;

    private Instant dueEndTime;

    private BookCopyDTO copy;

    private PatronAccountDTO patron;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Instant getDueEndTime() {
        return dueEndTime;
    }

    public void setDueEndTime(Instant dueEndTime) {
        this.dueEndTime = dueEndTime;
    }

    public BookCopyDTO getCopy() {
        return copy;
    }

    public void setCopy(BookCopyDTO copy) {
        this.copy = copy;
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
        if (!(o instanceof HoldDTO)) {
            return false;
        }

        HoldDTO holdDTO = (HoldDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, holdDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HoldDTO{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", dueEndTime='" + getDueEndTime() + "'" +
            ", copy=" + getCopy() +
            ", patron=" + getPatron() +
            "}";
    }
}
