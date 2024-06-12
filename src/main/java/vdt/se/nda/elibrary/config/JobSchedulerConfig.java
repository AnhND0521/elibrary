package vdt.se.nda.elibrary.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vdt.se.nda.elibrary.service.scheduler.HandleHoldExpirationJobsRunner;

@Configuration
@RequiredArgsConstructor
public class JobSchedulerConfig {

    private final HandleHoldExpirationJobsRunner handleHoldExpirationJobsRunner;

    @Bean
    public CommandLineRunner run() {
        return args -> {
            handleHoldExpirationJobsRunner.run();
        };
    }
}
