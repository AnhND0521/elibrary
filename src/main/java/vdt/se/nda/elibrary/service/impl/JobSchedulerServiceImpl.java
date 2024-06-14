package vdt.se.nda.elibrary.service.impl;

import java.time.Instant;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.quartz.*;
import org.springframework.stereotype.Service;
import vdt.se.nda.elibrary.domain.BookCopy;
import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.domain.enumeration.BookCopyStatus;
import vdt.se.nda.elibrary.domain.enumeration.PatronStatus;
import vdt.se.nda.elibrary.repository.CheckoutRepository;
import vdt.se.nda.elibrary.repository.HoldRepository;
import vdt.se.nda.elibrary.service.BookCopyService;
import vdt.se.nda.elibrary.service.JobSchedulerService;
import vdt.se.nda.elibrary.service.PatronAccountService;
import vdt.se.nda.elibrary.service.UserService;
import vdt.se.nda.elibrary.service.dto.AdminUserDTO;
import vdt.se.nda.elibrary.service.mapper.BookCopyMapper;
import vdt.se.nda.elibrary.service.mapper.PatronAccountMapper;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSchedulerServiceImpl implements JobSchedulerService {

    private final Scheduler scheduler;
    private final HoldRepository holdRepository;
    private final CheckoutRepository checkoutRepository;
    private final BookCopyService bookCopyService;
    private final PatronAccountService patronAccountService;
    private final UserService userService;
    private final BookCopyMapper bookCopyMapper;
    private final PatronAccountMapper patronAccountMapper;

    private void scheduleJob(String prefixName, Object id, Instant startTime, Class<? extends Job> jobClazz, Object... args) {
        try {
            String jobName = prefixName + "-job-" + id;
            String groupName = prefixName + "-jobs";
            String triggerName = prefixName + "-trigger-" + id;

            final JobKey jobKey = new JobKey(jobName, groupName);
            final JobDataMap data = new JobDataMap();
            for (int i = 0; i < args.length; i++) {
                data.put("arg" + i, args[i]);
            }

            final JobDetail job = JobBuilder.newJob(jobClazz).withIdentity(jobKey).setJobData(data).build();

            final Trigger trigger = TriggerBuilder
                .newTrigger()
                .withIdentity(triggerName, groupName)
                .startAt(new Date(startTime.toEpochMilli()))
                .build();

            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey);
            }

            scheduler.start();
            scheduler.scheduleJob(job, trigger);
            log.debug("Scheduled job {}", jobName);
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void scheduleHandleHoldExpirationJob(Hold hold) {
        scheduleJob(
            "hold-expiration",
            hold.getId(),
            hold.getEndTime(),
            HandleHoldExpirationJob.class,
            hold,
            bookCopyService,
            bookCopyMapper
        );
    }

    @Override
    public Runnable getHandleHoldExpirationJobsRunner() {
        return () -> holdRepository.findByIsCheckedOutAndEndTimeAfter(false, Instant.now()).forEach(this::scheduleHandleHoldExpirationJob);
    }

    @Override
    public void scheduleHandleCheckoutExpirationJob(Checkout checkout) {
        scheduleJob(
            "checkout-expiration",
            checkout.getId(),
            checkout.getEndTime(),
            HandleCheckoutExpirationJob.class,
            checkout,
            patronAccountService,
            userService,
            patronAccountMapper
        );
    }

    @Override
    public Runnable getHandleCheckoutExpirationJobsRunner() {
        return () ->
            checkoutRepository.findByIsReturnedAndEndTimeAfter(false, Instant.now()).forEach(this::scheduleHandleCheckoutExpirationJob);
    }

    public class HandleHoldExpirationJob implements Job {

        @Override
        public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
            JobDataMap data = jobExecutionContext.getJobDetail().getJobDataMap();
            var hold = (Hold) data.get("arg0");
            var bookCopyService = (BookCopyService) data.get("arg1");
            var bookCopyMapper = (BookCopyMapper) data.get("arg2");

            log.debug("Hold expired: " + hold.getId());
            BookCopy bookCopy = hold.getCopy().status(BookCopyStatus.AVAILABLE);
            bookCopyService.save(bookCopyMapper.toDto(bookCopy));
        }
    }

    public class HandleCheckoutExpirationJob implements Job {

        @Override
        public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
            JobDataMap data = jobExecutionContext.getJobDetail().getJobDataMap();
            var checkout = (Checkout) data.get("arg0");
            var patronAccountService = (PatronAccountService) data.get("arg1");
            var userService = (UserService) data.get("arg2");
            var patronAccountMapper = (PatronAccountMapper) data.get("arg3");

            log.debug("Checkout expired: " + checkout.getId());
            var patron = checkout.getPatron().status(PatronStatus.BLOCKED);
            patronAccountService.update(patronAccountMapper.toDto(patron));

            var user = patron.getUser();
            user.setActivated(false);
            userService.updateUser(new AdminUserDTO(user));
            // TODO: send notification mail
        }
    }
}
