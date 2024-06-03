package vdt.se.nda.elibrary.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import vdt.se.nda.elibrary.domain.enumeration.NotificationType;

/**
 * A DTO for the {@link vdt.se.nda.elibrary.domain.Notification} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class NotificationDTO implements Serializable {

    private Long id;

    private Instant sentAt;

    private NotificationType type;

    private PatronAccountDTO patron;

    private BookCopyDTO copy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public PatronAccountDTO getPatron() {
        return patron;
    }

    public void setPatron(PatronAccountDTO patron) {
        this.patron = patron;
    }

    public BookCopyDTO getCopy() {
        return copy;
    }

    public void setCopy(BookCopyDTO copy) {
        this.copy = copy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NotificationDTO)) {
            return false;
        }

        NotificationDTO notificationDTO = (NotificationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, notificationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NotificationDTO{" +
            "id=" + getId() +
            ", sentAt='" + getSentAt() + "'" +
            ", type='" + getType() + "'" +
            ", patron=" + getPatron() +
            ", copy=" + getCopy() +
            "}";
    }
}
