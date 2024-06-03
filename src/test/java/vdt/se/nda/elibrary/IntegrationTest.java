package vdt.se.nda.elibrary;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import vdt.se.nda.elibrary.ELibraryApp;
import vdt.se.nda.elibrary.config.AsyncSyncConfiguration;
import vdt.se.nda.elibrary.config.EmbeddedRedis;
import vdt.se.nda.elibrary.config.EmbeddedSQL;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { ELibraryApp.class, AsyncSyncConfiguration.class })
@EmbeddedRedis
@EmbeddedSQL
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public @interface IntegrationTest {
}
