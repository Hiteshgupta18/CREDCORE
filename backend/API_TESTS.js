// Manual API Tests for CrediCore Backend
// Use these in Postman, Insomnia, or Thunder Client

const BASE_URL = 'http://localhost:5000';

// ==========================================
// 1. HEALTH & ROOT ENDPOINTS
// ==========================================

// GET Health Check
// URL: http://localhost:5000/health
// Expected: { status: "OK", timestamp: "...", environment: "development" }

// GET Root
// URL: http://localhost:5000/
// Expected: API info with available endpoints

// ==========================================
// 2. AUTHENTICATION
// ==========================================

// POST Register User
// URL: http://localhost:5000/api/auth/register
// Headers: Content-Type: application/json
// Body:
{
  "email": "newuser@example.com",
  "password": "secure123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
// Expected: 201 Created with user object and JWT token

// POST Login
// URL: http://localhost:5000/api/auth/login
// Headers: Content-Type: application/json
// Body:
{
  "email": "admin@credcore.com",
  "password": "password123"
}
// Expected: 200 OK with user object and JWT token
// Save the token for authenticated requests!

// GET Current User
// URL: http://localhost:5000/api/auth/me
// Headers: 
//   Content-Type: application/json
//   Authorization: Bearer YOUR_JWT_TOKEN
// Expected: 200 OK with user profile

// ==========================================
// 3. HOSPITALS
// ==========================================

// GET All Hospitals
// URL: http://localhost:5000/api/hospitals
// Query params: ?page=1&limit=10&status=VERIFIED&type=PRIVATE&verified=true
// Expected: 200 OK with array of hospitals

// GET Single Hospital
// URL: http://localhost:5000/api/hospitals/:id
// Replace :id with actual hospital ID
// Expected: 200 OK with hospital details

// POST Create Hospital
// URL: http://localhost:5000/api/hospitals
// Headers: Content-Type: application/json
// Body:
{
  "name": "New Hospital",
  "registrationNo": "REG-2024-001",
  "licenseNumber": "LIC-2024-001",
  "email": "contact@hospital.com",
  "phone": "+91-141-1234567",
  "website": "https://hospital.com",
  "hospitalType": "PRIVATE",
  "addresses": [
    {
      "addressLine1": "123 Main Street",
      "addressLine2": "Near City Center",
      "city": "Jaipur",
      "state": "Rajasthan",
      "pincode": "302001",
      "zone": "Central",
      "isPrimary": true
    }
  ],
  "credentials": [
    {
      "type": "MEDICAL_LICENSE",
      "number": "MED-LIC-2024-001",
      "issuedBy": "Medical Council",
      "issuedDate": "2024-01-01T00:00:00.000Z",
      "expiryDate": "2029-01-01T00:00:00.000Z"
    }
  ]
}
// Expected: 201 Created with hospital object

// PUT Update Hospital
// URL: http://localhost:5000/api/hospitals/:id
// Headers: Content-Type: application/json
// Body:
{
  "name": "Updated Hospital Name",
  "phone": "+91-141-9999999"
}
// Expected: 200 OK with updated hospital

// DELETE Hospital
// URL: http://localhost:5000/api/hospitals/:id
// Expected: 200 OK with success message

// GET Search Hospitals
// URL: http://localhost:5000/api/hospitals/search/query?q=SMS&city=Jaipur&zone=Central
// Expected: 200 OK with matching hospitals

// PATCH Verify Hospital
// URL: http://localhost:5000/api/hospitals/:id/verify
// Headers: Content-Type: application/json
// Body:
{
  "verificationScore": 0.95,
  "notes": "All documents verified"
}
// Expected: 200 OK with verified hospital

// ==========================================
// 4. ADDRESSES
// ==========================================

// GET All Addresses
// URL: http://localhost:5000/api/addresses
// Expected: 200 OK with array of addresses

// GET Address by ID
// URL: http://localhost:5000/api/addresses/:id
// Expected: 200 OK with address details

// POST Create Address
// URL: http://localhost:5000/api/addresses
// Headers: Content-Type: application/json
// Body:
{
  "hospitalId": "HOSPITAL_ID_HERE",
  "addressLine1": "456 New Street",
  "addressLine2": "Near Park",
  "city": "Jaipur",
  "state": "Rajasthan",
  "pincode": "302002",
  "zone": "West",
  "isPrimary": false
}
// Expected: 201 Created with address object

// POST Validate Address (Jaccard Similarity)
// URL: http://localhost:5000/api/addresses/validate
// Headers: Content-Type: application/json
// Body:
{
  "address": "Flat B-402 Shanti Heights Mansarovar Jaipur"
}
// Expected: 200 OK with similarity matches
// Response includes top 5 matching reference addresses with scores

// POST Bulk Validate Addresses
// URL: http://localhost:5000/api/addresses/validate/bulk
// Headers: Content-Type: application/json
// Body:
{
  "addresses": [
    "Flat B-402 Shanti Heights Mansarovar Jaipur",
    "Plot 108 Sunrise Residency Ajmer Road",
    "H No 45/A Shiv Vihar Colony Pratap Nagar"
  ]
}
// Expected: 200 OK with validation results for each address

// ==========================================
// 5. SCHEMES
// ==========================================

// GET All Schemes
// URL: http://localhost:5000/api/schemes?isActive=true
// Expected: 200 OK with array of schemes

// GET Scheme by ID
// URL: http://localhost:5000/api/schemes/:id
// Expected: 200 OK with scheme details

// POST Create Scheme
// URL: http://localhost:5000/api/schemes
// Headers: Content-Type: application/json
// Body:
{
  "name": "New Health Scheme",
  "description": "Scheme for rural healthcare",
  "category": "Health Insurance",
  "eligibility": "Rural families below poverty line",
  "benefits": "Free medical treatment up to 2 lakh",
  "isActive": true
}
// Expected: 201 Created with scheme object

// POST Enroll Hospital in Scheme
// URL: http://localhost:5000/api/schemes/enroll
// Headers: Content-Type: application/json
// Body:
{
  "hospitalId": "HOSPITAL_ID_HERE",
  "schemeId": "SCHEME_ID_HERE"
}
// Expected: 201 Created with enrollment record

// GET Schemes by Hospital
// URL: http://localhost:5000/api/schemes/hospital/:hospitalId
// Expected: 200 OK with schemes enrolled by hospital

// ==========================================
// 6. VALIDATIONS
// ==========================================

// GET All Validations
// URL: http://localhost:5000/api/validations?status=PENDING&page=1&limit=10
// Expected: 200 OK with array of validation records

// GET Validation by ID
// URL: http://localhost:5000/api/validations/:id
// Expected: 200 OK with validation details

// POST Create Validation (OCR Result)
// URL: http://localhost:5000/api/validations
// Headers: Content-Type: application/json
// Body:
{
  "userId": "USER_ID_HERE",
  "hospitalId": "HOSPITAL_ID_HERE",
  "inputData": {
    "scannedText": "SMS Hospital JLN Marg Jaipur Registration No: RAJ-SMS-001",
    "documentType": "registration",
    "confidence": 0.85
  },
  "extractedInfo": {
    "hospitalName": "SMS Hospital",
    "address": "JLN Marg, Jaipur",
    "registrationNo": "RAJ-SMS-001",
    "licenseNumber": null
  },
  "validationScore": 0.85
}
// Expected: 201 Created with validation record

// PATCH Update Validation Status
// URL: http://localhost:5000/api/validations/:id/status
// Headers: Content-Type: application/json
// Body:
{
  "status": "APPROVED",
  "notes": "All information verified successfully"
}
// Expected: 200 OK with updated validation

// GET Validations by User
// URL: http://localhost:5000/api/validations/user/:userId
// Expected: 200 OK with user's validation history

// GET Validations by Hospital
// URL: http://localhost:5000/api/validations/hospital/:hospitalId
// Expected: 200 OK with hospital's validation history

// ==========================================
// NOTES:
// ==========================================
// 1. Replace :id, :userId, :hospitalId with actual IDs from database
// 2. For authenticated endpoints, include JWT token in Authorization header
// 3. All POST/PUT/PATCH requests need Content-Type: application/json header
// 4. Status values: PENDING, VERIFIED, REJECTED, UNDER_REVIEW, APPROVED, REQUIRES_REVIEW
// 5. Hospital types: GOVERNMENT, PRIVATE, NGO, CLINIC
// 6. User roles: USER, ADMIN, VERIFIER
