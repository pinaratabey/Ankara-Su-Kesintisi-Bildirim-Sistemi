package com.askitracker.service;

import com.askitracker.entity.Neighborhood;
import com.askitracker.entity.Outage;
import com.askitracker.entity.OutageLocation;
import com.askitracker.repository.NeighborhoodRepository;
import com.askitracker.repository.OutageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScrapingService {

    private final OutageRepository outageRepository;
    private final NeighborhoodRepository neighborhoodRepository;

    @Value("${app.aski-url:https://www.aski.gov.tr/tr/duyurular}")
    private String askiUrl;

    private static final int TIMEOUT_MS = 30000;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    @Transactional
    public List<Outage> scrapeOutages() {
        List<Outage> outages = new ArrayList<>();

        try {
            log.info("Starting to scrape ASKİ website: {}", askiUrl);

            Document doc = Jsoup.connect(askiUrl)
                    .timeout(TIMEOUT_MS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .get();

            // The new page format seems to be unstructured or table-based.
            // We'll search for elements containing "Arıza Tarihi" which is a key identifier
            // for an outage block.
            Elements dateElements = doc.getElementsContainingOwnText("Arıza Tarihi");

            for (Element dateEl : dateElements) {
                try {
                    // Navigate up to find the container of the outage info (likely a table row or a
                    // div)
                    // We go up deep enough to capture the full context (Title, Date, Detail)
                    // Usually 2-3 levels up is safe for table cells or nested divs.
                    // We'll try to find a parent that contains all the necessary keywords.
                    Element container = findContainer(dateEl);
                    if (container != null) {
                        Outage outage = parseOutageFromText(container.text());
                        if (outage != null) {
                            // Check if this outage is already added to avoid duplicates from multiple
                            // matching elements in same block
                            boolean exists = outages.stream()
                                    .anyMatch(o -> o.getTitle().equals(outage.getTitle()) &&
                                            o.getStartTime().equals(outage.getStartTime()));
                            if (!exists) {
                                outages.add(outage);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to parse outage block: {}", e.getMessage());
                }
            }

            log.info("Scraped {} water outage announcements", outages.size());

        } catch (Exception e) {
            log.error("Error scraping ASKİ website: {}", e.getMessage(), e);
        }

        return outages;
    }

    private Element findContainer(Element startElement) {
        Element current = startElement;
        for (int i = 0; i < 5; i++) { // Go up max 5 levels
            if (current == null)
                return null;
            String text = current.text();
            if (text.contains("Arıza Tarihi") && text.contains("Detay")) {
                return current;
            }
            current = current.parent();
        }
        return startElement.parent(); // Fallback
    }

    private Outage parseOutageFromText(String text) {
        Outage outage = new Outage();
        outage.setSourceUrl(askiUrl);
        outage.setPublishedAt(LocalDateTime.now());

        // Text format expectation:
        // [District Name] Arıza Tarihi: [Date] Tamir Tarihi: [Date] Detay: [Text]
        // Etkilenen Yerler: [Text]

        // 1. Extract Dates
        String startPattern = "Arıza Tarihi:\\s*(\\d{2}\\.\\d{2}\\.\\d{4}\\s+\\d{2}:\\d{2}:\\d{2})";
        String endPattern = "Tamir Tarihi:\\s*(\\d{2}\\.\\d{2}\\.\\d{4}\\s+\\d{2}:\\d{2}:\\d{2})";

        Pattern pStart = Pattern.compile(startPattern);
        Matcher mStart = pStart.matcher(text);
        if (mStart.find()) {
            outage.setStartTime(parseDateTime(mStart.group(1)));
        }

        Pattern pEnd = Pattern.compile(endPattern);
        Matcher mEnd = pEnd.matcher(text);
        if (mEnd.find()) {
            outage.setEndTime(parseDateTime(mEnd.group(1)));
        }

        // 2. Extract Description (Detay)
        String detailPattern = "Detay:\\s*(.*?)(?:Etkilenen Yerler:|$)";
        Pattern pDetail = Pattern.compile(detailPattern);
        Matcher mDetail = pDetail.matcher(text);
        if (mDetail.find()) {
            outage.setDescription(mDetail.group(1).trim());
        }

        // 3. Extract Title (District) - Usually at the beginning before "Arıza Tarihi"
        String titlePattern = "^(.*?)(?:Arıza Tarihi:|$)";
        Pattern pTitle = Pattern.compile(titlePattern);
        Matcher mTitle = pTitle.matcher(text);
        if (mTitle.find()) {
            String rawTitle = mTitle.group(1).trim();
            // Clean up if it's too long or contains garbage
            if (rawTitle.length() > 50) {
                rawTitle = "Su Kesintisi";
            }
            outage.setTitle(rawTitle.isEmpty() ? "Su Kesintisi" : rawTitle);
        } else {
            outage.setTitle("Su Kesintisi");
        }

        // 4. Extract Affected Neighborhoods (for location mapping)
        Set<OutageLocation> locations = extractLocationsFromText(text, outage);
        outage.setOutageLocations(locations);

        return outage;
    }

    private LocalDateTime parseDateTime(String dateStr) {
        try {
            // Format: 18.12.2025 19:00:00
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            return LocalDateTime.parse(dateStr, formatter);
        } catch (Exception e) {
            log.error("Error parsing date: {}", dateStr);
            return LocalDateTime.now();
        }
    }

    private Set<OutageLocation> extractLocationsFromText(String text, Outage outage) {
        Set<OutageLocation> locations = new HashSet<>();
        String lowerText = text.toLowerCase();

        List<Neighborhood> allNeighborhoods = neighborhoodRepository.findAll();

        for (Neighborhood neighborhood : allNeighborhoods) {
            // Check if neighborhood name is present in the "Etkilenen Yerler" part
            // specifically if possible,
            // or just the whole text if simpler.
            if (lowerText.contains(neighborhood.getName().toLowerCase())) {
                OutageLocation location = new OutageLocation();
                location.setOutage(outage);
                location.setNeighborhood(neighborhood);
                locations.add(location);
            }
        }
        return locations;
    }
}
