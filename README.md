
# E-Learning Platform (Endterm Project)

## Project Overview

This project is a web-based **E-Learning Platform** developed as an endterm project for the *Advanced Databases (NoSQL)* course.
The system allows **instructors** to create and manage courses, and **students** to enroll, track learning progress, and leave reviews.

The application is built using **Express.js** with **MongoDB** as the primary database and uses **session-based authentication**. Both backend logic and frontend rendering are implemented within a single Express application.

---

## Technology Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas)
* **ODM:** Mongoose
* **Frontend:** EJS (server-side rendering), HTML, CSS
* **Authentication:** express-session + connect-mongo
* **Deployment:** Render

---

## User Roles

### Student

* Register and log in
* Browse available courses
* Enroll in courses
* Track course progress
* Drop courses
* Leave one review per course

### Instructor

* Register with instructor code
* Create new courses
* Edit course syllabus (add/remove lessons)
* View and manage own courses

---

## Database Design

### Database Name

```
elearning_platform
```

### Collections

| Collection    | Description                              |
| ------------- | ---------------------------------------- |
| `users`       | Stores students and instructors          |
| `courses`     | Stores course data and embedded syllabus |
| `enrollments` | Tracks student enrollment and progress   |
| `reviews`     | Stores course reviews                    |
| `sessions`    | Stores session data (auto-generated)     |

---

### Embedded Documents

* **Syllabus** is embedded directly inside the `courses` collection:

```js
syllabus: [
  { week, topic, content }
]
```

---

### Referenced Collections

* `enrollments.student_id → users`
* `enrollments.course_id → courses`
* `reviews.student_id → users`
* `reviews.course_id → courses`

---

## MongoDB Features Used

### Advanced Update Operators

* `$push` – add syllabus lesson
* `$pull` – remove syllabus lesson
* `$inc` – increment course progress
* `$set` – update completion status

### Aggregation Framework

Used to generate analytics such as top courses:

* `$lookup`
* `$group`
* `$avg`
* `$sort`

### Compound Indexes (Data Integrity & Performance)

```js
// Enrollment uniqueness
(student_id, course_id) — unique

// Review uniqueness
(course_id, student_id) — unique
```

These indexes:

* Prevent duplicate enrollments and reviews
* Improve query performance

---

## Authentication & Authorization

* Session-based authentication using `express-session`
* Sessions stored in MongoDB using `connect-mongo`
* Role-based access control:

  * Students cannot access instructor pages
  * Instructors cannot enroll or review courses

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login         |
| POST   | `/auth/logout`   | Logout        |

### Courses

| Method | Endpoint           | Role       |
| ------ | ------------------ | ---------- |
| GET    | `/api/courses`     | All        |
| POST   | `/api/courses`     | Instructor |
| PATCH  | `/api/courses/:id` | Instructor |
| DELETE | `/api/courses/:id` | Instructor |

### Enrollments

| Method | Endpoint                        | Role    |
| ------ | ------------------------------- | ------- |
| POST   | `/api/enrollments`              | Student |
| PATCH  | `/api/enrollments/:id/progress` | Student |
| DELETE | `/api/enrollments/:id`          | Student |

### Reviews

| Method | Endpoint       | Role    |
| ------ | -------------- | ------- |
| POST   | `/api/reviews` | Student |

### Analytics

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | `/api/analytics/top-courses` | Aggregated analytics |

---

## Pages (Frontend)

* `/` – Course list
* `/courses/:id` – Course details
* `/login` – Authentication
* `/my-enrollments` – Student dashboard
* `/instructor/courses` – Instructor dashboard
* `/instructor/create-course`
* `/instructor/edit-course/:id`
* `/analytics` – Analytics page

---

##  How to Run Locally

### 1️. Install dependencies

```bash
npm install
```

### 2️. Create `.env` file

```env
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret
INSTRUCTOR_CODE=your_code
NODE_ENV=development
```

### 3️. Run the app

```bash
npm run dev
```

---

## Deployment (Render)

* Build command: `npm install`
* Start command: `npm start`
* Environment variables:

  * `MONGO_URI`
  * `SESSION_SECRET`
  * `INSTRUCTOR_CODE`
  * `NODE_ENV=production`
* MongoDB Atlas network access: `0.0.0.0/0`

---

## Team Contribution

Syrym Shadiyarbek

* Backend logic
* MongoDB schemas & indexes
* API implementation
* Authentication

Aitbek Nugmanov

* Frontend pages (EJS)
* Styling and UI
* Form handling
* Testing & debugging

---

## Conclusion

This project demonstrates the use of **MongoDB as a NoSQL database** with advanced features such as **embedded documents, aggregation pipelines, compound indexes, and session persistence**.
The application follows best practices in backend development and fulfills all requirements of the Advanced Databases endterm project.