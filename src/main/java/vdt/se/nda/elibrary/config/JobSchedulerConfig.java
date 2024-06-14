package vdt.se.nda.elibrary.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vdt.se.nda.elibrary.service.JobSchedulerService;

@Configuration
@RequiredArgsConstructor
public class JobSchedulerConfig {

    private final JobSchedulerService jobSchedulerService;

    @Bean
    public CommandLineRunner run() {
        return args -> {
            jobSchedulerService.getHandleHoldExpirationJobsRunner().run();
            jobSchedulerService.getHandleCheckoutExpirationJobsRunner().run();
        };
    }
}
