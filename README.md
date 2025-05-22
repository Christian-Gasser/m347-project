# BBW/BMS Grades Management App

A modern web application for managing and analyzing grades for BBW and BMS students.

## 📋 Project Overview

This application allows students to systematically record, manage, and analyze their grades. The system provides an intuitive user interface for CRUD management of grades with basic analysis features.

### Data Model (DTO)
- **Subject**: Name of the subject/module
- **Grade**: Achieved score/grade (1.0 - 6.0)
- **Date**: Exam date or entry date

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React/Vite)  │◄──►│  (Spring Boot)  │◄──►│ (PostgreSQL/    │
│   Port: 80      │    │   Port: 8080    │    │  MariaDB)       │
│                 │    │                 │    │  Port: 3306/    │
└─────────────────┘    └─────────────────┘    │  5432)          │
                                              └─────────────────┘
```

## 👥 Project Team & Responsibilities

| Role | Name | Responsibilities |
|------|------|-----------------|
| **Project Lead** | [Christian-Gasser G. & AdminGodZ] | Project coordination, architecture decisions |
| **Frontend Developer** | [Name] | React application, UI/UX, Frontend Docker |
| **Backend Developer** | [Name] | Spring Boot API, database integration |
| **DevOps Engineer** | [Name] | CI/CD pipeline, Docker Compose, infrastructure |
| **QA Engineer** | [Name] | E2E tests, testing strategy |

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Local Development

1. **Clone repository**
   ```bash
   git clone [repository-url]
   cd bbw-bms-grades-app
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

3. **Start application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080
   - Health Check: http://localhost:8080/actuator/health

## 📁 Project Structure

```
bbw-bms-grades-app/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── Dockerfile           # Frontend Docker build
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/bbw/grades/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access layer
│   │       └── dto/         # Data transfer objects
│   ├── Dockerfile           # Backend Docker build
│   ├── build.gradle
│   └── application.yml
├── database/                # Database setup
│   ├── init/
│   │   └── schema.sql       # Database schema
│   └── docker-compose.db.yml
├── .github/workflows/       # CI/CD pipeline
│   └── ci.yml
├── docker-compose.yml       # Multi-service setup
├── .env.example             # Environment variables template
└── README.md
```

## 🔧 Technical Details

### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI)
- **Build**: Multi-stage Docker build with nginx
- **Features**: 
  - Create, edit, delete, view grades
  - Basic grade statistics
  - Responsive design

### Backend
- **Framework**: Spring Boot 3.x
- **Build Tool**: Gradle
- **Database**: JPA/Hibernate with PostgreSQL/MariaDB
- **Health Monitoring**: Spring Actuator
- **API**: RESTful endpoints for CRUD operations

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grades` | Retrieve all grades |
| GET | `/api/grades/{id}` | Retrieve single grade |
| POST | `/api/grades` | Create new grade |
| PUT | `/api/grades/{id}` | Update grade |
| DELETE | `/api/grades/{id}` | Delete grade |
| GET | `/api/grades/statistics` | Grade statistics |

### Database
- **Engine**: PostgreSQL 15 or MariaDB 10.9
- **Initialization**: Automatic schema setup on container start
- **Volumes**: Persistent data storage
- **User Management**: Separate database users for the application

### Docker Setup
All services use multi-stage builds:
- **Frontend**: nginx-alpine without node_modules
- **Backend**: openjdk:17-alpine without Gradle cache
- **Database**: Official PostgreSQL/MariaDB images

## 🔍 Testing

### E2E Tests
Complete CRUD test suite runs automatically in CI pipeline:
- Create grade
- Edit grade
- View grade
- Delete grade
- Retrieve statistics

### Run local tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && ./gradlew test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### CI/CD Pipeline
Automated builds and tests via GitHub Actions:

1. **Build Stage**: Docker images for all services
2. **Test Stage**: Unit tests + integration tests
3. **E2E Stage**: docker-compose up + Cypress tests
4. **Deploy Stage**: Push images to registry (optional)

### Manual Deployment
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Health checks
curl http://localhost:8080/actuator/health
```

## 📊 Monitoring (Optional)

If monitoring stack is enabled:
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
- **Dashboards**: Pre-configured metrics for application performance

## 🔒 Security

- No secrets in docker-compose.yml
- Environment variables via .env files
- Database with dedicated users and permissions
- Health checks for all containers

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
docker-compose down
sudo lsof -i :8080  # Check port
```

**Database connection issues**
```bash
docker-compose logs database
docker-compose exec database psql -U grades_user -d grades_db
```

**Frontend build errors**
```bash
docker-compose logs frontend
docker system prune -a  # Clear Docker cache
```

## 📝 Development

### Code Standards
- **Backend**: No SonarLint issues, clean code principles
- **Frontend**: ESLint + Prettier configuration
- **Git**: Conventional commits

### Local development without Docker
```bash
# Backend
cd backend && ./gradlew bootRun

# Frontend
cd frontend && npm run dev

# Database
docker-compose up database
```

## 📋 TODO / Roadmap

- [ ] Extended grade analysis (averages, trends)
- [ ] Export functionality (PDF, Excel)
- [ ] User authentication
- [ ] Multi-semester support
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Create pull request

## 📄 License

This project is developed for educational purposes and is under [MIT License](LICENSE).

## 📞 Support

For questions or issues:
- Create GitHub issues
- Contact team lead
- Check documentation in `/docs` directory

---

**Developed for BBW/BMS Students** 🎓
