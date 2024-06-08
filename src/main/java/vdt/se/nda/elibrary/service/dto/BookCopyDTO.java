package vdt.se.nda.elibrary.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link vdt.se.nda.elibrary.domain.BookCopy} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BookCopyDTO implements Serializable {

    private Long id;

    @Size(max = 255)
    private String title;

    private Integer yearPublished;

    private BookDTO book;

    private PublisherDTO publisher;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getYearPublished() {
        return yearPublished;
    }

    public void setYearPublished(Integer yearPublished) {
        this.yearPublished = yearPublished;
    }

    public BookDTO getBook() {
        return book;
    }

    public void setBook(BookDTO book) {
        this.book = book;
    }

    public PublisherDTO getPublisher() {
        return publisher;
    }

    public void setPublisher(PublisherDTO publisher) {
        this.publisher = publisher;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookCopyDTO)) {
            return false;
        }

        BookCopyDTO bookCopyDTO = (BookCopyDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, bookCopyDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BookCopyDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", yearPublished=" + getYearPublished() +
            ", book=" + getBook() +
            ", publisher=" + getPublisher() +
            "}";
    }
}
