# 🏦 Banking System

A full-stack **Banking System** web application built with **Spring Boot** and **React**. It provides a secure, modern platform for managing bank accounts, performing fund transfers, tracking transactions, and administering users — all with JWT-based authentication and role-based access control.

---

## ✨ Features

### 👤 Customer Features
- **User Registration & Login** — Secure authentication with JWT tokens
- **Forgot Password** — Email-based OTP password recovery
- **Dashboard** — View account summary, balance, and recent activity
- **Deposit** — Deposit funds into your account
- **Fund Transfer** — Transfer money to registered beneficiaries
- **Transaction History** — View and track all past transactions
- **Beneficiary Management** — Add and manage transfer beneficiaries
- **Chatbot Assistance** — Built-in chatbot placeholder for customer support

### 🔐 Admin Features
- **Admin Dashboard** — Overview of system-wide statistics
- **Pending Approvals** — Approve or reject pending account registrations
- **User Management** — View and manage all registered users
- **Transaction Monitoring** — Monitor all transactions across the system

### 🛡️ Security
- JWT-based stateless authentication
- Role-based access control (`CUSTOMER` / `ADMIN`)
- Protected routes on both frontend and backend
- Spring Security integration

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 3.2.5** | REST API framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | ORM / Database access |
| **MySQL** | Relational database |
| **JWT (jjwt 0.12.3)** | Token-based authentication |
| **Spring Mail** | Email notifications (OTP) |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build & dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool & dev server |
| **React Router DOM 7** | Client-side routing |
| **Redux Toolkit** | State management |
| **Axios** | HTTP client |
| **React Icons** | Icon library |
| **Tailwind CSS 4** | Utility-first CSS framework |

---

## 📁 Project Structure

```
Banking-System/
├── Back-end/
│   └── Banking_system/
│       ├── src/main/java/com/banking/Banking_system/
│       │   ├── BankingSystemApplication.java    # Application entry point
│       │   ├── configure/                       # App configuration
│       │   ├── controller/                      # REST controllers
│       │   │   ├── AccountController.java       # Account operations
│       │   │   ├── AdminController.java         # Admin endpoints
│       │   │   ├── AuthController.java          # Login / Register
│       │   │   └── BeneficiaryController.java   # Beneficiary CRUD
│       │   ├── dto/                             # Data Transfer Objects
│       │   ├── entity/                          # JPA Entities
│       │   │   ├── Account.java
│       │   │   ├── Beneficiary.java
│       │   │   ├── Transaction.java
│       │   │   └── User.java
│       │   ├── exception/                       # Custom exceptions
│       │   ├── repository/                      # Spring Data repositories
│       │   ├── security/                        # JWT & Security config
│       │   └── service/                         # Business logic
│       ├── src/main/resources/
│       │   └── application.properties           # App configuration
│       └── pom.xml                              # Maven dependencies
│
├── front-end/
│   └── banking--frontend/
│       ├── src/
│       │   ├── App.jsx                          # Route definitions
│       │   ├── main.jsx                         # App entry point
│       │   ├── Component/                       # Reusable components
│       │   │   ├── Navbar.jsx
│       │   │   ├── SlideBar.jsx
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── ChatbotPlaceholder.jsx
│       │   ├── Pages/                           # Page components
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── ForgotPassword.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Deposit.jsx
│       │   │   ├── Transfer.jsx
│       │   │   ├── Transaction.jsx
│       │   │   ├── Beneficiary.jsx
│       │   │   └── Admin/
│       │   │       ├── AdminDashboard.jsx
│       │   │       ├── PendingApprovals.jsx
│       │   │       ├── AllUsers.jsx
│       │   │       └── AdminTransactions.jsx
│       │   ├── Store/                           # Redux store & slices
│       │   └── api/                             # Axios API services
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+**
- **Node.js 18+** & **npm**
- **MySQL 8.0+**
- **Maven** (or use the included Maven wrapper)

### 1. Database Setup

```sql
CREATE DATABASE banking_system_proj;
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd Back-end/Banking_system

# Update database credentials in src/main/resources/application.properties
# spring.datasource.username=<your-mysql-username>
# spring.datasource.password=<your-mysql-password>

# Run the application
./mvnw spring-boot:run
```

The backend server will start at **http://localhost:8080**

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd front-end/banking--frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at **http://localhost:5173**

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP |

### Account Operations
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/account/dashboard` | Get account dashboard data |
| `POST` | `/api/account/deposit` | Deposit funds |
| `POST` | `/api/account/transfer` | Transfer funds |
| `GET` | `/api/account/transactions` | Get transaction history |

### Beneficiary Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/beneficiaries` | List all beneficiaries |
| `POST` | `/api/beneficiaries` | Add a new beneficiary |
| `DELETE` | `/api/beneficiaries/{id}` | Remove a beneficiary |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin dashboard stats |
| `GET` | `/api/admin/pending-approvals` | List pending registrations |
| `PUT` | `/api/admin/approve/{id}` | Approve/reject a user |
| `GET` | `/api/admin/users` | List all users |
| `GET` | `/api/admin/transactions` | List all transactions |

> **Note**: All endpoints except `/api/auth/**` require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## ⚙️ Configuration

Key configuration properties in `application.properties`:

| Property | Description |
|---|---|
| `server.port` | Server port (default: `8080`) |
| `spring.datasource.url` | MySQL connection URL |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `app.jwt.secret` | JWT signing secret (Base64 encoded) |
| `app.jwt.expiration` | JWT token expiry in ms (default: 24 hrs) |
| `spring.mail.*` | SMTP configuration for email OTP |

> ⚠️ **Security Tip**: Never commit real credentials to version control. Use environment variables or a `.env` file for sensitive values.

---

## 📸 Screenshots

> _Screenshots coming soon — run the application locally to explore the UI!_

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Panjamohan**
- GitHub: [@Panjamohan1819](https://github.com/Panjamohan1819)

---

<p align="center">Made with ❤️ using Spring Boot & React</p>
