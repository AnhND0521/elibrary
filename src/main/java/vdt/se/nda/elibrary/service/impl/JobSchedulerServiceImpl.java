package vdt.se.nda.elibrary.service.impl;

import java.time.Instant;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.stereotype.Service;
import vdt.se.nda.elibrary.service.JobSchedulerService;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSchedulerServiceImpl implements JobSchedulerService {

    private final Scheduler scheduler;

    @Override
    public void scheduleJob(String prefixName, Object id, Instant startTime, Class<? extends Job> jobClazz, Object... args) {
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
    public void scheduleJob(String prefixName, Object id, Instant startTime, Runnable runner) {
        class JobImpl implements Job {

            @Override
            public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
                JobDataMap data = jobExecutionContext.getJobDetail().getJobDataMap();
                var runner = (Runnable) data.get("arg0");
                runner.run();
            }
        }
        scheduleJob(prefixName, id, startTime, JobImpl.class, runner);
    }

    @Override
    public void cancelJob(String prefixName, Object id) {
        try {
            String jobName = prefixName + "-job-" + id;
            String groupName = prefixName + "-jobs";
            final JobKey jobKey = new JobKey(jobName, groupName);
            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey);
                log.debug("Cancelled job {}", jobName);
            }
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }
}
