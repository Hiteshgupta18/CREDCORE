# CrediCore Backend API

Complete backend server for hospital validation and directory management system with PostgreSQL database.

## 🚀 Features

- **Hospital Management**: Full CRUD operations for hospitals
- **Address Validation**: Jaccard similarity algorithm for address matching
- **Scheme Management**: Government health schemes enrollment
- **Validation Records**: OCR scan result tracking
- **User Authentication**: JWT-based auth with role-based access
- **Database**: PostgreSQL with Prisma ORM

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Edit `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/credcore?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Setup Database

```bash
# Create database migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database with sample data
npm run db:seed
```

### 4. Start Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Hospitals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospitals` | Get all hospitals |
| GET | `/api/hospitals/:id` | Get hospital by ID |
| POST | `/api/hospitals` | Create new hospital |
| PUT | `/api/hospitals/:id` | Update hospital |
| DELETE | `/api/hospitals/:id` | Delete hospital |
| GET | `/api/hospitals/search/query` | Search hospitals |
| GET | `/api/hospitals/scheme/:schemeId` | Get hospitals by scheme |
| PATCH | `/api/hospitals/:id/verify` | Verify hospital |

### Addresses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/addresses` | Get all addresses |
| GET | `/api/addresses/:id` | Get address by ID |
| POST | `/api/addresses` | Create address |
| PUT | `/api/addresses/:id` | Update address |
| DELETE | `/api/addresses/:id` | Delete address |
| GET | `/api/addresses/hospital/:hospitalId` | Get hospital addresses |
| POST | `/api/addresses/validate` | Validate single address |
| POST | `/api/addresses/validate/bulk` | Bulk validate addresses |

### Schemes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schemes` | Get all schemes |
| GET | `/api/schemes/:id` | Get scheme by ID |
| POST | `/api/schemes` | Create scheme |
| PUT | `/api/schemes/:id` | Update scheme |
| DELETE | `/api/schemes/:id` | Delete scheme |
| GET | `/api/schemes/hospital/:hospitalId` | Get hospital schemes |
| POST | `/api/schemes/enroll` | Enroll hospital in scheme |

### Validations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/validations` | Get all validations |
| GET | `/api/validations/:id` | Get validation by ID |
| POST | `/api/validations` | Create validation |
| PATCH | `/api/validations/:id/status` | Update status |
| GET | `/api/validations/user/:userId` | Get user validations |
| GET | `/api/validations/hospital/:hospitalId` | Get hospital validations |

## 📊 Database Schema

### Core Models

- **User**: User accounts with role-based access
- **Hospital**: Hospital information and credentials
- **Address**: Hospital locations with verification status
- **Scheme**: Government health schemes
- **HospitalScheme**: Many-to-many hospital-scheme relation
- **Credential**: Hospital licenses and certifications
- **Document**: Document storage metadata
- **HospitalValidation**: OCR validation records
- **ReferenceAddress**: Master addresses for Jaccard matching
- **ActivityLog**: System activity tracking

## 🧮 Jaccard Similarity Algorithm

The address validation uses Jaccard similarity to match addresses:

```javascript
// Example usage
const similarity = calculateSimilarity(
  "Flat B-402 Shanti Heights Mansarovar Jaipur",
  "Flat No. B-402, Shanti Heights Near D-Mart, Mansarovar South Jaipur 302020"
);
// Returns: 0.75 (75% match)
```

**Algorithm Steps:**
1. Normalize text (lowercase, remove punctuation)
2. Remove common prefixes (Flat, Plot, House, etc.)
3. Tokenize into word sets
4. Calculate: intersection / union
5. Threshold: 0.6 (60%) for valid match

## 🗄️ Database Commands

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (clears all data)
npm run db:reset

# Open Prisma Studio (GUI)
npm run prisma:studio

# View database
npx prisma studio
```

## 📦 Sample Data

After seeding, you'll have:

- **2 Users**: Admin and regular user
- **4 Schemes**: Ayushman Bharat, CGHS, Bhamashah, ESI
- **5 Hospitals**: SMS, Fortis, Eternal, CK Birla, Narayana
- **10 Reference Addresses**: For Jaccard matching
- **Sample Validations**: Test OCR records

### Default Login Credentials

```
Admin:
  Email: admin@credcore.com
  Password: password123

User:
  Email: user@credcore.com
  Password: password123
```

## 🔧 Prisma Commands

```bash
# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Pull schema from database
npx prisma db pull

# Push schema to database
npx prisma db push
```

## 📝 Example Requests

### Create Hospital

```bash
curl -X POST http://localhost:5000/api/hospitals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Hospital",
    "registrationNo": "REG-001",
    "licenseNumber": "LIC-001",
    "email": "contact@hospital.com",
    "phone": "+91-141-1234567",
    "hospitalType": "PRIVATE",
    "addresses": [{
      "addressLine1": "123 Main Street",
      "city": "Jaipur",
      "state": "Rajasthan",
      "pincode": "302001",
      "isPrimary": true
    }]
  }'
```

### Validate Address

```bash
curl -X POST http://localhost:5000/api/addresses/validate \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Flat B-402 Shanti Heights Mansarovar Jaipur"
  }'
```

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "secure123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## 🏗️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Seed data script
├── controllers/         # Request handlers
│   ├── auth.controller.js
│   ├── hospital.controller.js
│   ├── address.controller.js
│   ├── scheme.controller.js
│   └── validation.controller.js
├── routes/             # API routes
│   ├── auth.routes.js
│   ├── hospital.routes.js
│   ├── address.routes.js
│   ├── scheme.routes.js
│   └── validation.routes.js
├── services/           # Business logic
│   └── jaccard.service.js
├── .env               # Environment variables
├── .gitignore
├── package.json
└── server.js          # Entry point
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)
- Environment variable protection

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
pg_isready

# Verify connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/credcore"
```

### Migration Issues

```bash
# Reset database completely
npm run db:reset

# Or manually
npx prisma migrate reset --force
```

### Prisma Client Not Found

```bash
# Regenerate Prisma Client
npx prisma generate
```

## 📄 License

MIT

## 👥 Support

For issues and questions, contact: support@credcore.com
