package vdt.se.nda.elibrary.service;

import java.time.Instant;
import org.quartz.Job;
import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.domain.Hold;

public interface JobSchedulerService {
    void scheduleJob(String prefixName, Object id, Instant startTime, Class<? extends Job> jobClazz, Object... args);
    void scheduleJob(String prefixName, Object id, Instant startTime, Runnable runnable);
}
