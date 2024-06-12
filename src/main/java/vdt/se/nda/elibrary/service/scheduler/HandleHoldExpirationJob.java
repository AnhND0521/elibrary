package vdt.se.nda.elibrary.service.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import vdt.se.nda.elibrary.domain.Hold;
import vdt.se.nda.elibrary.domain.enumeration.BookCopyStatus;
import vdt.se.nda.elibrary.repository.BookCopyRepository;

@Slf4j
public class HandleHoldExpirationJob implements Job {

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobDataMap data = jobExecutionContext.getJobDetail().getJobDataMap();
        var hold = (Hold) data.get("hold");
        var bookCopyRepository = (BookCopyRepository) data.get("bookCopyRepository");

        log.debug("Hold expired: " + hold.getId());
        hold.getCopy().setStatus(BookCopyStatus.AVAILABLE);
        bookCopyRepository.save(hold.getCopy());
    }
}
