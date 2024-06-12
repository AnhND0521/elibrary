package vdt.se.nda.elibrary.service.scheduler;

import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import vdt.se.nda.elibrary.repository.HoldRepository;
import vdt.se.nda.elibrary.service.JobSchedulerService;

@Component
@RequiredArgsConstructor
@Slf4j
public class HandleHoldExpirationJobsRunner implements Runnable {

    private final HoldRepository holdRepository;
    private final JobSchedulerService jobSchedulerService;

    @Override
    public void run() {
        holdRepository
            .findByIsCheckedOutAndEndTimeAfter(false, Instant.now())
            .forEach(jobSchedulerService::scheduleHandleHoldExpirationJob);
    }
}
