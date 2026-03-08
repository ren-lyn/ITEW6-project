# CCS Profiler System

A full 8-phase profiling and document management system built with Laravel (Backend) and React (Frontend).
Features Role-Based Access Control (RBAC) for Administrators, Faculty, and Students.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Make sure you have the following installed on your local machine:
- [PHP](https://www.php.net/downloads) (v8.1 or higher)
- [Composer](https://getcomposer.org/download/)
- [Node.js & npm](https://nodejs.org/en/download/) (v16 or higher)
- [MySQL](https://dev.mysql.com/downloads/) or any compatible database server

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ITEW6-project
```

### 2. Backend Setup (Laravel)
Open a terminal and navigate to the `backend` directory:
```bash
cd backend

# Install PHP dependencies
composer install

# Create environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

**Database Configuration:**
Open the `.env` file in the `backend` folder and configure your database credentials. Make sure you have created an empty database in MySQL (e.g., `ccs_profiler_db`) matching your `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ccs_profiler_db
DB_USERNAME=root
DB_PASSWORD=
```

**Run Migrations, Seeders, & Storage Link:**
```bash
# Run database migrations and seed default data (Document Types)
php artisan migrate:fresh --seed

# Create a symbolic link to securely serve uploaded documents
php artisan storage:link

# Start the Laravel backend server
php artisan serve
```
*The backend API should now be running at `http://localhost:8000` or `http://127.0.0.1:8000`.*

### 3. Frontend Setup (React/Vite)
Open a **new** terminal window and navigate to the `frontend` directory:
```bash
cd frontend

# Install JavaScript dependencies
npm install

# Start the React frontend server
npm run dev
```
*The frontend application should now be running at `http://localhost:5173`.*

---

## 🛠️ Testing the Application

1. Open your browser and go to the frontend URL (usually `http://localhost:5173`).
2. **Register a New Account:** Click on "Register" to create a new `Student` or `Faculty` account.
3. **Explore Dashboard:** After registering, you will be redirected to the User Dashboard showing your *Profile Completion Score* and *Document Uploads*.
4. **Admin Access:** To test admin features (Verifications, Archiving, Reporting), you need an admin account. If no admin seeder was run, you can manually change a user's role in the database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
5. Log in with the admin account to access the Institutional Intelligence Dashboard and Verification Approvals.

## 📂 Project Structure
- `/backend`: Laravel API handling authentication, business logic, file uploads, and MySQL interactions.
- `/frontend`: React SPA (Single Page Application) utilizing React Router DOM and Bootstrap for the UI and Role-Based Dashboards.
