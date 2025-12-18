# ASKİ Water Outage Notification System - Architecture Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [Security Considerations](#security-considerations)
6. [Scalability & Performance](#scalability--performance)
7. [Technology Decisions](#technology-decisions)

---

## 🎯 System Overview

### Purpose
Automated notification system that tracks ASKİ water outage announcements and sends location-based email alerts to subscribers.

### Key Features
- ✅ Automated web scraping (every 30 minutes)
- ✅ Email-based subscription (no login required)
- ✅ Location-based filtering (district + neighborhood)
- ✅ Historical outage archive
- ✅ Public statistics dashboard
- ✅ One-click unsubscribe

---

## 🏛️ Architecture Layers

### 1. Presentation Layer (Frontend)
**Technology:** React 18 + Vite + Tailwind CSS

**Components:**
- `HomePage`: Landing page with recent outages
- `SubscribeForm`: Email + location selection
- `OutageList`: Searchable/filterable outage history
- `StatisticsPage`: Charts and analytics
- `UnsubscribePage`: Token-based unsubscribe

**Responsibilities:**
- User interface rendering
- Form validation
- API communication
- State management

---

### 2. Application Layer (Backend)
**Technology:** Spring Boot 3.x + Java 17

#### 2.1 REST API Controllers

```
SubscriptionController
├── POST   /api/subscriptions          → Create subscription
├── DELETE /api/subscriptions/{token}  → Unsubscribe
└── GET    /api/subscriptions/verify   → Verify email

OutageController
├── GET /api/outages                    → List all outages (paginated)
├── GET /api/outages/{id}               → Get outage details
└── GET /api/outages/recent             → Recent outages

LocationController
├── GET /api/districts                  → List all districts
└── GET /api/neighborhoods              → List neighborhoods by district

StatisticsController
└── GET /api/statistics                 → Get statistics data
```

#### 2.2 Service Layer

**ScrapingService**
- Jsoup-based HTML parsing
- Outage data extraction from ASKİ website
- Error handling & retry logic
- Logging of scraping results

**OutageService**
- Business logic for outage management
- Duplicate detection
- Notification triggering
- Location matching

**SubscriptionService**
- Subscription creation & validation
- Token generation (UUID)
- Email uniqueness check
- Active subscription management

**EmailService**
- HTML email template rendering
- SMTP connection management
- Outage notification emails
- Welcome/confirmation emails

**StatisticsService**
- Aggregate outage data by district
- Time-series analysis
- Frequency calculations

#### 2.3 Scheduled Tasks

```java
@Scheduled(fixedRate = 1800000) // 30 minutes
public void scrapeOutages() { ... }

@Scheduled(cron = "0 0 * * * *") // Every hour
public void checkNewOutages() { ... }

@Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
public void generateStatistics() { ... }
```

---

### 3. Data Access Layer
**Technology:** Spring Data JPA + Hibernate

**Repositories:**
```java
SubscriptionRepository extends JpaRepository<Subscription, Long>
OutageRepository extends JpaRepository<Outage, Long>
DistrictRepository extends JpaRepository<District, Long>
NeighborhoodRepository extends JpaRepository<Neighborhood, Long>
OutageLocationRepository extends JpaRepository<OutageLocation, Long>
```

**Custom Queries:**
- Find subscriptions by neighborhood
- Search outages by date range
- Get outages by district/neighborhood
- Calculate statistics

---

### 4. Database Layer
**Technology:** PostgreSQL (Supabase hosted)

**Tables:**

```sql
-- Core entities
subscriptions (email, neighborhood_id, unsubscribe_token, is_active)
outages (title, description, start_time, end_time, source_url)
districts (name, code)
neighborhoods (name, district_id)

-- Junction table
outage_locations (outage_id, neighborhood_id)
```

**Indexes:**
```sql
CREATE INDEX idx_subscription_email ON subscriptions(email);
CREATE INDEX idx_subscription_token ON subscriptions(unsubscribe_token);
CREATE INDEX idx_outage_published_at ON outages(published_at DESC);
CREATE INDEX idx_outage_locations_outage ON outage_locations(outage_id);
CREATE INDEX idx_outage_locations_neighborhood ON outage_locations(neighborhood_id);
```

---

## 🔄 Data Flow

### User Subscription Flow
1. User enters email + selects district/neighborhood
2. Frontend sends POST request to `/api/subscriptions`
3. Backend validates input (email format, location exists)
4. System checks for duplicate subscriptions
5. Generate unique unsubscribe token (UUID)
6. Save subscription to database
7. Send confirmation email with unsubscribe link
8. Return success response

### Scraping & Notification Flow
1. **Scheduler triggers** scraping task (every 30 min)
2. **ScrapingService** fetches ASKİ website HTML
3. **Jsoup parses** HTML and extracts outage data
4. For each scraped outage:
   - Check if outage already exists (by title + date)
   - If new → save to database
   - Query affected subscriptions by location
   - Send email notification to each subscriber
   - Mark outage as "notifications_sent"
5. Log scraping results (new/updated/failed)

### Statistics Generation Flow
1. **Scheduler triggers** daily at 2 AM
2. Query database for aggregated data:
   - Outages per district (last 30 days, 6 months, 1 year)
   - Average outage duration
   - Most affected neighborhoods
3. Cache results (optional)
4. Update statistics table

---

## 🔒 Security Considerations

### Input Validation
- Email format validation (regex)
- SQL injection prevention (JPA/Hibernate)
- XSS protection (React escapes by default)
- CSRF token for state-changing operations

### Data Protection
- No password storage (stateless subscriptions)
- Unique unsubscribe tokens (UUID v4)
- HTTPS only in production
- Database connection over SSL

### Rate Limiting (Future Enhancement)
- Limit subscription requests per IP
- Prevent email bombing
- Scraping backoff strategy

### CORS Configuration
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://your-frontend.vercel.app")
                .allowedMethods("GET", "POST", "DELETE");
    }
}
```

---


## 🤔 Technology Decisions

### Why Spring Boot?
- ✅ Built-in scheduler support
- ✅ Excellent JPA/Hibernate integration
- ✅ Rich email & web libraries
- ✅ Easy deployment (single JAR)
- ✅ Great for learning enterprise Java

### Why React?
- ✅ Component reusability
- ✅ Large ecosystem & community
- ✅ Fast development with Vite
- ✅ Good for CV/portfolio
- ✅ Modern UI capabilities

### Why Supabase PostgreSQL?
- ✅ Free tier (500 MB storage, unlimited API requests)
- ✅ Automatic backups
- ✅ Built-in connection pooling
- ✅ Easy setup & management
- ✅ Standard PostgreSQL (no vendor lock-in)

### Why Jsoup?
- ✅ Simple HTML parsing API
- ✅ CSS selector support
- ✅ Lightweight & fast
- ✅ No JavaScript rendering needed (ASKİ uses server-side rendering)

### Why Gmail SMTP?
- ✅ Free up to 500 emails/day
- ✅ Easy setup with Spring Mail
- ✅ Reliable delivery
- ✅ Good for MVP/learning project

---

## 🚀 Deployment Strategy

### Development Environment
```
Frontend: http://localhost:5173 (Vite dev server)
Backend:  http://localhost:8080 (Spring Boot)
Database: Supabase cloud (shared)
```

### Production Environment
```
Frontend: https://aski-takip.vercel.app (Vercel)
Backend:  https://aski-api.railway.app (Railway)
Database: Supabase production instance
```

### CI/CD Pipeline (Future)
1. Push to GitHub
2. GitHub Actions runs tests
3. If tests pass → deploy to staging
4. Manual approval → deploy to production

---

## 📊 Monitoring & Logging

### Health Checks
```
GET /actuator/health
GET /actuator/metrics
```

### Logging Strategy
```
INFO:  Scraping started, Subscription created
WARN:  Email send failure (retry), Scraping timeout
ERROR: Database connection lost, Critical failure
```

### Key Metrics to Track
- Scraping success rate
- Email delivery rate
- API response times
- Active subscriptions count
- Daily outage count

---

## 📝 API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Subscription created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SUBSCRIPTION",
    "message": "This email is already subscribed to this location"
  }
}
```

---

## 🎓 Learning Outcomes

By completing this project, you will learn:

1. **Backend Development**
   - RESTful API design
   - Scheduled tasks & background jobs
   - Email service integration
   - Web scraping techniques

2. **Database Design**
   - Entity relationships
   - Query optimization
   - Transaction management

3. **Frontend Development**
   - React component architecture
   - API integration
   - Form handling & validation
   - Responsive design

4. **DevOps**
   - Application deployment
   - Environment configuration
   - Monitoring & logging

5. **System Design**
   - Architecture patterns
   - Data flow design
   - Scalability considerations