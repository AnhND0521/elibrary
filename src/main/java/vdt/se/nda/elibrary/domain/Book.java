package vdt.se.nda.elibrary.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 255)
    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @ManyToOne
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Category category;

    @ManyToMany
    @JoinTable(name = "rel_book__author", joinColumns = @JoinColumn(name = "book_id"), inverseJoinColumns = @JoinColumn(name = "author_id"))
    @JsonIgnoreProperties(value = { "books" }, allowSetters = true)
    private Set<Author> authors = new HashSet<>();

    @OneToMany(mappedBy = "book")
    @JsonIgnoreProperties(value = { "book", "patron" }, allowSetters = true)
    private Set<WaitlistItem> waitlists = new HashSet<>();

    @OneToMany(mappedBy = "book")
    @JsonIgnoreProperties(value = { "book", "publisher", "checkouts", "holds" }, allowSetters = true)
    private Set<BookCopy> copies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Book id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Book title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Book category(Category category) {
        this.setCategory(category);
        return this;
    }

    public Set<Author> getAuthors() {
        return this.authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public Book authors(Set<Author> authors) {
        this.setAuthors(authors);
        return this;
    }

    public Book addAuthor(Author author) {
        this.authors.add(author);
        author.getBooks().add(this);
        return this;
    }

    public Book removeAuthor(Author author) {
        this.authors.remove(author);
        author.getBooks().remove(this);
        return this;
    }

    public Set<WaitlistItem> getWaitlists() {
        return this.waitlists;
    }

    public void setWaitlists(Set<WaitlistItem> waitlistItems) {
        if (this.waitlists != null) {
            this.waitlists.forEach(i -> i.setBook(null));
        }
        if (waitlistItems != null) {
            waitlistItems.forEach(i -> i.setBook(this));
        }
        this.waitlists = waitlistItems;
    }

    public Book waitlists(Set<WaitlistItem> waitlistItems) {
        this.setWaitlists(waitlistItems);
        return this;
    }

    public Book addWaitlist(WaitlistItem waitlistItem) {
        this.waitlists.add(waitlistItem);
        waitlistItem.setBook(this);
        return this;
    }

    public Book removeWaitlist(WaitlistItem waitlistItem) {
        this.waitlists.remove(waitlistItem);
        waitlistItem.setBook(null);
        return this;
    }

    public Set<BookCopy> getCopies() {
        return this.copies;
    }

    public void setCopies(Set<BookCopy> bookCopies) {
        if (this.copies != null) {
            this.copies.forEach(i -> i.setBook(null));
        }
        if (bookCopies != null) {
            bookCopies.forEach(i -> i.setBook(this));
        }
        this.copies = bookCopies;
    }

    public Book copies(Set<BookCopy> bookCopies) {
        this.setCopies(bookCopies);
        return this;
    }

    public Book addCopy(BookCopy bookCopy) {
        this.copies.add(bookCopy);
        bookCopy.setBook(this);
        return this;
    }

    public Book removeCopy(BookCopy bookCopy) {
        this.copies.remove(bookCopy);
        bookCopy.setBook(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Book)) {
            return false;
        }
        return id != null && id.equals(((Book) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Book{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
