package com.askitracker.scheduler;

import com.askitracker.entity.Outage;
import com.askitracker.service.OutageService;
import com.askitracker.service.ScrapingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScrapingScheduler {

    private final ScrapingService scrapingService;
    private final OutageService outageService;

    /**
     * Scrape ASKİ website every 30 minutes
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes
    public void scrapeOutages() {
        log.info("Starting scheduled scraping task");

        try {
            List<Outage> outages = scrapingService.scrapeOutages();

            for (Outage outage : outages) {
                outageService.saveNewOutage(outage);
            }

            log.info("Completed scraping task. Found {} outages", outages.size());
        } catch (Exception e) {
            log.error("Error during scheduled scraping", e);
        }
    }

    /**
     * Check for new outages and send notifications every hour
     */
    @Scheduled(cron = "0 0 * * * *")
    public void checkAndNotify() {
        log.info("Starting notification check");

        try {
            outageService.processNewOutagesAndNotify();
            log.info("Completed notification check");
        } catch (Exception e) {
            log.error("Error during notification check", e);
        }
    }
}
