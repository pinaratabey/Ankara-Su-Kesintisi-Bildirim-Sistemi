# ASKİ Water Outage Notification System
# Su Kesintisi Bildirim Sistemi

An automated notification system that tracks ASKİ (Ankara Water and Sewerage Administration) water outage announcements and sends location-based email alerts to subscribers.

## 🌟 Features

- ✅ **Automated Web Scraping** - Monitors ASKİ website every 30 minutes
- ✅ **Email Notifications** - Instant alerts when outages are announced
- ✅ **Location-based Filtering** - Subscribe by district and neighborhood
- ✅ **Historical Archive** - Browse past outages with search and filters
- ✅ **Statistics Dashboard** - View outage trends and analytics
- ✅ **One-click Unsubscribe** - Easy subscription management

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Spring Mail
- Jsoup (Web Scraping)
- PostgreSQL / H2

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

## 📁 Project Structure

```
├── backend/
│   ├── src/main/java/com/askitracker/
│   │   ├── controller/         # REST API endpoints
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access
│   │   ├── entity/            # JPA entities
│   │   ├── dto/               # Data transfer objects
│   │   ├── config/            # Configuration classes
│   │   └── scheduler/         # Scheduled tasks
│   └── src/main/resources/
│       ├── templates/email/   # Email templates
│       └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   └── services/         # API client
│   └── index.html
│
└── documents/                 # Architecture docs
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- PostgreSQL (optional, H2 for development)

### Backend Setup

```bash
cd backend

# Configure email settings in application.properties
# Set MAIL_USERNAME and MAIL_PASSWORD environment variables

# Run with Maven
./mvnw spring-boot:run
```

The backend will start at `http://localhost:8080`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

## 📝 API Endpoints

| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| POST   | /api/subscriptions             | Create subscription      |
| DELETE | /api/subscriptions/{token}     | Unsubscribe             |
| GET    | /api/subscriptions/verify      | Verify email            |
| GET    | /api/outages                   | List all outages        |
| GET    | /api/outages/recent            | Recent outages          |
| GET    | /api/districts                 | List districts          |
| GET    | /api/neighborhoods             | List neighborhoods      |
| GET    | /api/statistics                | Get statistics          |

## ⚙️ Configuration

### Email (Gmail SMTP)
```properties
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

### Database (Production)
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USER}
spring.datasource.password=${DATABASE_PASSWORD}
```

## 🚢 Deployment

### Backend (Railway)
1. Push to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy

## 📄 License

MIT License

## 👤 Author

Your Name

---

Made with ❤️ for Ankara residents