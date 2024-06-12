package vdt.se.nda.elibrary.service.impl;

import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.stereotype.Service;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.repository.BookCopyRepository;
import vdt.se.nda.elibrary.service.JobSchedulerService;
import vdt.se.nda.elibrary.service.scheduler.HandleHoldExpirationJob;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSchedulerServiceImpl implements JobSchedulerService {

    private final Scheduler scheduler;
    private final BookCopyRepository bookCopyRepository;

    @Override
    public void scheduleHandleHoldExpirationJob(Hold hold) {
        final String PREFIX = "hold-expiration";
        final String GROUP = "hold-jobs";
        try {
            final JobKey jobKey = new JobKey(PREFIX + "-job-" + hold.getId(), GROUP);
            final JobDataMap data = new JobDataMap();
            data.put("hold", hold);
            data.put("bookCopyRepository", bookCopyRepository);
            final JobDetail job = JobBuilder.newJob(HandleHoldExpirationJob.class).withIdentity(jobKey).setJobData(data).build();

            final Trigger trigger = TriggerBuilder
                .newTrigger()
                .withIdentity(PREFIX + "-trigger-" + hold.getId(), GROUP)
                .startAt(new Date(hold.getEndTime().toEpochMilli()))
                .build();

            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey);
            }

            scheduler.start();
            scheduler.scheduleJob(job, trigger);
            log.debug("Scheduled handle hold expiration job for hold {}", hold.getId());
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }
}
