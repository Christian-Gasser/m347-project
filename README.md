# M347 Grades Management App

A modern web application for managing and analyzing grades for BBW and BMS students.

## 📋 Project Overview

This application allows students to systematically record, manage, and analyze their grades. The system provides an intuitive user interface for CRUD management of grades with basic analysis features.

### Data Model (DTO)
- **Subject**: Name of the subject/module
- **Grade**: Achieved score/grade (1.0 - 6.0)
- **Date**: Exam date

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React/Vite)  │◄──►│  (Spring Boot)  │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```


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
   - Frontend: http://localhost:3000
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
- **Framework**: React 19 with Vite
- **UI Library**: Material-UI (MUI)
- **Build**: Multi-stage Docker build with nginx
- **Features**: 
  - Create, edit, delete, view grades
  - Basic grade statistics
  - Responsive design

### Backend
- **Framework**: Spring Boot 3.x
- **Build Tool**: Gradle
- **Database**: JPA with PostgreSQL
- **Health Monitoring**: Spring Actuator
- **API**: RESTful endpoints for CRUD operations

### API Endpoints

| Method | Endpoint | Description | Return Body | 2xx Status Code |
|--------|----------|-------------|--------------|-----------------|
| GET | `/api/spaces` | Retrieve all spaces | Array of Objects (Space) | 200 OK |
| GET | `/api/spaces/{spaceId}` | Retrieve a single space by Id| Object (Space) | 200 OK |
| POST | `/api/spaces` | Create a new space | Object (Space) | 201 Created |
| PUT | `/api/spaces/{spaceId}` | Update a space | Object (Space) | 200 OK |
| DELETE | `/api/spaces/{spaceId}` | Delete a space | - | 200 OK |
| GET | `/api/spaces/{spaceId}/semesters` | Retrieve all semesters from one space | Array of Objects (Space) | 200 OK |
| GET | `/api/spaces/{spaceId}/semesters/{semesterId}` | Retrieve a single semester by Id| Object (Space) | 200 OK |
| POST | `/api/spaces/{spaceId}/semesters` | Create a new semester in a space | Object (Space) | 201 Created |
| PUT | `/api/spaces/{spaceId}/semesters/{semesterId}` | Update a semester of a space | Object (Space) | 200 OK |
| DELETE | `/api/spaces/{spaceId}/semesters/{semesterId}` | Delete a semester of a space | - | 200 OK |
| GET | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects` | Retrieve all subjects from one semester | Array of Objects (Subject) | 200 OK |
| GET | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}` | Retrieve a single subject of a semester by Id  | Object (Subject) | 200 OK |
| POST | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects` | Create a new subject in a semester | Object (Subject) | 201 Created |
| PUT | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}` | Update a subject of a semester | Object (Subject) | 200 OK |
| DELETE | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}` | Delete a subject of a semester | - | 200 OK |
| GET | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}/grades` | Retrieve all grade of a subject | Array of Objects (grade) | 200 OK |
| GET | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}/grades/{gradeId}` | Retrieve a single grade of a subject by Id | Object (grade) | 200 OK |
| POST | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}/grades` | Create a new grade in a subject | Object (grade) | 201 Created |
| PUT | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}/grades/{gradeId}` | Update a grade of a subject | Object (grade) | 200 OK |
| DELETE | `/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}/grades/{gradeId}` | Delete a grade of a subject | - | 200 OK |



### Database
- **Engine**: PostgreSQL
- **Initialization**: Automatic schema setup on container start
- **Volumes**: Persistent data storage
- **User Management**: Separate database users for the application

### Entity Relation Diagram (ERD)
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────────┐
│ Space           │       │ Semester        │       │ Subject         │       │ Grade               │
│-----------------│1     m│-----------------│1     m│-----------------│1     m│---------------------│
│ id: int         │◄─────►│ id: int         │◄─────►│ id: int         │◄─────►│ id: int             │
│ name: String    │       │ name: String    │       │ name: String    │       │ name: String        │
│                 │       │ spaceId: int    │       │ semesterId: int │       │ examDate: Date      │
└─────────────────┘       │                 │       │                 │       │ gradeWeight: double │
                          └─────────────────┘       └─────────────────┘       │ grade: double       │
                                                                              │ subjectId: int      │
                                                                              │                     │
                                                                              └─────────────────────┘
```


### Docker Setup
All services use multi-stage builds:
- **Frontend**: nginx-alpine without node_modules
- **Backend**: openjdk:23-alpine without Gradle cache
- **Database**: Official PostgreSQL image

## 🔍 Testing

### E2E Tests
Complete CRUD test suite runs automatically in CI pipeline:
- Create grade
- Edit grade
- View grade
- Delete grade

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

---
