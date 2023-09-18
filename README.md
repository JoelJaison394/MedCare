# MedCare - Your Health Companion

MedCare is a comprehensive healthcare management platform designed to revolutionize the way healthcare services are accessed and managed. Our mission is to empower patients, healthcare providers, and administrators with innovative tools and features for a seamless healthcare experience.

## Key Features

- **User Registration:** Create and manage user profiles securely.
- **Medical Records:** Easily store and access medical records and history.
- **Appointment Scheduling:** Book appointments with healthcare professionals hassle-free.
- **Sanction and Embargo Checks:** Ensure compliance with trade embargo lists for patient security.
- **Audit Logging:** Maintain a detailed audit trail for user actions and system events.
- **Enhanced Security:** Implement state-of-the-art security measures to protect user data.
- **Efficient Testing:** Robust testing and monitoring for system efficiency and latency.
- **Integration:** Seamlessly integrate with other healthcare systems and services.
- **User-Friendly Interface:** Intuitive and user-centric design for a smooth user experience.

Join us in our journey to simplify healthcare management, enhance patient care, and promote better health outcomes.

MedCare - Your Health, Our Priority.

---

## API Endpoints

Here are the main API endpoints of the MedCare platform:

- **User Registration:** `/api/users/registeruser` - Register new users.
- **User Details:** `/api/users/getuserdetails` - Get user details.
- **User Details by Pangea ID:** `/api/users/getuserdetails/:pangeaId` - Get user details by Pangea ID.
- **Medical Record Upload:** `/api/file/upload` - Upload medical records.
- **Medical Record Retrieval (PDF):** `/api/file/document/:id` - Get a specific medical record in PDF format.
- **User's Medical Records:** `/api/file/document/user/:id` - Get a user's medical records.
- **Audit Log:** `/api/auditlog` - Get audit details.

---

## Technologies Used

MedCare utilizes a modern technology stack to provide efficient healthcare management:

### Backend

- **Node.js and Express.js**: The backend is built on Node.js, leveraging Express.js for handling HTTP requests and routing.

- **MongoDB**: We use MongoDB as the database management system for flexible and scalable data storage.

- **Pangea**: Pangea is integrated to ensure advanced security features for user data and medical records.

- **JSON Web Tokens (JWTs)**: JWTs are used for user authentication and secure communication between the frontend and backend.

### Frontend

The frontend is built using:

- **Next.js**: A powerful React framework for server-side rendering and improved SEO.

- **Tailwind CSS**: A utility-first CSS framework for creating a responsive and visually appealing user interface.

---

## Local Development

To run MedCare locally, follow these steps:

1. Clone the repository:
   ```shell
   git clone https://github.com/JoelJaison394/MedCare.git 

2.  Navigate to the project directory:
    
    shellCopy code
    
    `cd MedCare` 
    
3.  Install dependencies:
    
    shellCopy code
    
    `npm install` 
    
4.  Create an `.env` file in the root directory and set the following environment variables:
    
    envCopy code
    
    `PORT=8000
    PANGEA_DOMAIN="aws.us.pangea.cloud"
    PANGEA_VAULTTOKEN="your_pangea_vault_token"
    PANGEA_VAULTCONFIGID="your_pangea_vault_config_id"
    PANGEA_AUDITTOKEN="your_pangea_audit_token"
    PANGEA_AUDITCONFIGID="your_pangea_audit_config_id"
    PANGEA_USERAUTH_JWTSECRECT="your_jwt_secret"
    DATABASE_URL="mongodb+srv://your_username:your_password@cluster0.jji2kcp.mongodb.net/medcare?retryWrites=true&w=majority"` 
    

    
5.  Start the development server:
    
    `npm run dev` 
    
6.  Access the application at [http://localhost:8000](http://localhost:8000/).
    

----------
## angea Integration

Pangea, a robust security platform, plays a crucial role in ensuring the security and integrity of MedCare's healthcare data. Here's where Pangea is integrated into the project:

### User Authentication

-   **File:** `userController.js`
-   **Usage:** Pangea is integrated into the user authentication process to provide advanced security features during user registration and login. It ensures that user data remains confidential and secure.

### Medical Record Storage

-   **Files:** `fileuploadController.js`
-   **Usage:** Pangea secures the storage of medical records. It ensures that all medical documents uploaded by users are stored in a highly secure and tamper-proof environment. This guarantees the integrity and privacy of medical records.

### Audit Logging

-   **File:** `auditController.js`
-   **Usage:** Pangea also plays a role in maintaining a detailed audit trail for user actions and system events. It provides robust logging capabilities, allowing administrators to monitor system activities effectively.

### Environment Variables

Pangea-related environment variables must be set in the `.env` file to enable seamless integration:

-   `PANGEA_DOMAIN`: The Pangea domain where the services are hosted.
-   `PANGEA_VAULTTOKEN`: Your Pangea Vault Token for secure access.
-   `PANGEA_VAULTCONFIGID`: Pangea Vault Configuration ID for configuration management.
-   `PANGEA_AUDITTOKEN`: Your Pangea Audit Token for audit logging.
-   `PANGEA_AUDITCONFIGID`: Pangea Audit Configuration ID for configuring audit logs.

## Frontend Repository

The frontend code for MedCare is available in a separate repository: [MedCare Frontend](https://github.com/vivekkj123/medcare)
