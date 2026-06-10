# IRON AI - The Kinetic Gym Assistant

A high-performance fitness ecosystem leveraging AI for biomechanical data, tailored nutrition, and dynamic workout engineering.

## Tech Stack
- **Frontend**: React + Vite + Tailwind V4
- **Backend**: Django REST Framework + SimpleJWT Authentication
- **Database**: PostgreSQL 15
- **Orchestration**: Docker Compose

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or equivalent Docker engine) installed and running.

## How to Run the App

### 1. Start the Containers
Open your terminal in the root directory of the project (where `docker-compose.yaml` is located) and run:
```bash
docker compose up --build -d
```
*This will build the images and start the `db`, `backend`, and `frontend` containers in the background.*

### 2. Run Database Migrations
On your very first run, you need to set up the PostgreSQL database schema. Execute these commands:
```bash
docker compose exec backend python manage.py makemigrations users fitness nutrition chatbot
docker compose exec backend python manage.py migrate
```

### 3. Create Initial Accounts (Recommended)
To log into the app, you should create some user accounts.

**Create an Admin (Superuser):**
```bash
docker compose exec backend python manage.py createsuperuser
```
*(Follow the interactive prompts to set your admin username, email, and password).*

**Create a Normal User (Quick Setup):**
```bash
docker compose exec backend python manage.py shell -c "from users.models import User; User.objects.filter(username='user').exists() or User.objects.create_user('user', 'user@example.com', 'user')"
```
*(This automatically creates a standard user with the username `user` and password `user`).*

### 4. Access the Application
- **Frontend App (Vite Development Server)**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:8000](http://localhost:8000)
- **Django Admin Panel**: [http://localhost:8000/admin](http://localhost:8000/admin) (Log in with your superuser credentials here)

---

## Stopping the App
To stop the running containers without losing data:
```bash
docker compose down
```

To stop the containers **and** delete all data in the database (useful for a complete reset):
```bash
docker compose down -v
```
