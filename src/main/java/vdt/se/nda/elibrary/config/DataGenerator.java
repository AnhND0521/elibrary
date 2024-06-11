package vdt.se.nda.elibrary.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import vdt.se.nda.elibrary.domain.*;
import vdt.se.nda.elibrary.domain.enumeration.BookCopyStatus;
import vdt.se.nda.elibrary.repository.*;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataGenerator {

    private RestTemplate restTemplate = new RestTemplate();
    private final TaskExecutor taskExecutor;
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final BookCopyRepository bookCopyRepository;
    private final PublisherRepository publisherRepository;

    @Bean
    public CommandLineRunner getCommandLineRunner() {
        return args -> {
            if (bookRepository.count() == 0) fetchBooks();
        };
    }

    private void fetchBooks() {
        log.info("Fetching books");
        String baseUrl = "https://openlibrary.org";
        String coverBaseUrl = "https://covers.openlibrary.org/b/id/";
        List<String> subjects = List.of(
            "Fantasy",
            "Historical Fiction",
            "Horror",
            "Humor",
            "Literature",
            "Magic",
            "Mystery and detective stories",
            "Plays",
            "Poetry",
            "Romance",
            "Science Fiction",
            "Short Stories",
            "Thriller",
            "Young Adult",
            "Biology",
            "Chemistry",
            "Mathematics",
            "Physics",
            "Programming",
            "Management",
            "Entrepreneurship",
            "Business Economics",
            "Business Success",
            "Finance",
            "Ancient Civilization",
            "Archaeology",
            "Anthropology",
            "World War II",
            "Social Life and Customs",
            "Anthropology",
            "Religion",
            "Political Science",
            "Psychology"
        );

        int number = 100;
        for (String subject : subjects) taskExecutor.execute(() -> {
            log.info("Fetching category: {}", subject);
            Category category = categoryRepository.findByName(subject).orElse(null);
            if (category == null) {
                category = new Category();
                category.setName(subject);
                categoryRepository.save(category);
            }
            final Category categoryFinal = category;
            try {
                CountDownLatch latch = new CountDownLatch(number);

                ResponseEntity<String> response = restTemplate.getForEntity(
                    baseUrl +
                    "/subjects/" +
                    subject.toLowerCase().replaceAll("\\s+", "_") +
                    ".json?limit=" +
                    number +
                    "&published_in=1900-2024",
                    String.class
                );
                JsonNode root = new ObjectMapper().readTree(response.getBody());

                for (var work : root.get("works")) taskExecutor.execute(() -> {
                    String title = work.get("title").asText();
                    if (bookRepository.existsByTitle(title)) return;

                    Book book = new Book();
                    // basic info
                    book.setTitle(title);
                    book.setImageUrl(coverBaseUrl + work.get("cover_id").asText() + "-L.jpg");
                    book.setCategory(categoryFinal);
                    book.setAuthors(new HashSet<>());

                    // fetch authors
                    for (var authorInfo : work.get("authors")) {
                        String name = authorInfo.get("name").asText();
                        Author author = authorRepository.findByName(name).orElse(null);
                        if (author == null) {
                            author = new Author();
                            author.setName(name);
                            authorRepository.save(author);
                        }
                        book.getAuthors().add(author);
                    }

                    bookRepository.save(book);
                    book.setCopies(new HashSet<>());

                    // fetch copies
                    ResponseEntity<String> copiesResponse = restTemplate.getForEntity(
                        baseUrl + work.get("key").asText() + "/editions.json",
                        String.class
                    );
                    JsonNode copiesRoot = null;
                    try {
                        copiesRoot = new ObjectMapper().readTree(copiesResponse.getBody());
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                        return;
                    }

                    for (var entry : copiesRoot.get("entries")) {
                        BookCopy copy = new BookCopy();
                        copy.setBook(book);
                        copy.setTitle(entry.get("title").asText());

                        // find publisher
                        if (entry.get("publishers") == null) continue;
                        String publisherName = entry.get("publishers").get(0).asText();
                        Publisher publisher = publisherRepository.findByName(publisherName).orElse(null);
                        if (publisher == null) {
                            publisher = new Publisher();
                            publisher.setName(publisherName);
                            publisherRepository.save(publisher);
                        }
                        copy.setPublisher(publisher);

                        // find publish year
                        String publishDate = entry.get("publish_date").asText();
                        Pattern pattern = Pattern.compile("\\d{4}"); // Matches exactly four digits
                        Matcher matcher = pattern.matcher(publishDate);
                        List<String> potentialYears = new ArrayList<>();
                        while (matcher.find()) {
                            potentialYears.add(matcher.group());
                        }
                        if (!potentialYears.isEmpty()) copy.setYearPublished(Integer.parseInt(potentialYears.get(0)));

                        // find language
                        if (entry.get("languages") != null) {
                            String key = entry.get("languages").get(0).get("key").asText();
                            String[] parts = key.split("/");
                            String language = parts[parts.length - 1];
                            copy.setLanguage(language);
                        }

                        copy.setStatus(BookCopyStatus.AVAILABLE);

                        bookCopyRepository.save(copy);
                        book.getCopies().add(copy);
                    }

                    bookRepository.save(book);
                    log.info(
                        String.format(
                            "Category '%s': enerated book %d/%d: '%s'",
                            categoryFinal.getName(),
                            number - latch.getCount() + 1,
                            number,
                            book.getTitle()
                        )
                    );
                    latch.countDown();
                });
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        });
        log.info("Done fetching books");
    }
}
