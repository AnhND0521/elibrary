package vdt.se.nda.elibrary.service;

import vdt.se.nda.elibrary.domain.Checkout;
import vdt.se.nda.elibrary.domain.Hold;

public interface JobSchedulerService {
    void scheduleHandleHoldExpirationJob(Hold hold);
    Runnable getHandleHoldExpirationJobsRunner();
    void scheduleHandleCheckoutExpirationJob(Checkout checkout);
    Runnable getHandleCheckoutExpirationJobsRunner();
}
