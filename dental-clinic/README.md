# 🦷 Dental Clinic Management System

A full-stack web application for managing a dental clinic's appointments, doctors, and patient interactions. Built with React (frontend), PHP (backend), and MySQL (database).

## ✨ Features

### Public Pages
- **Home** – Hero section with photo, services preview, "Why Choose Us", doctor listings with search/filter (click a doctor to book directly with them), about section
- **Services** – Browse all services with category filters, search, and detailed service modals with pricing and duration
- **Book Appointment** – Book appointments with optional doctor preference, auto-filled service/doctor selection from links, and an auto-generated unique booking code with a full booking summary shown on confirmation
- **My Appointments** – Look up appointment details and cancel using the booking code
- **Contact** – Contact form with an embedded map showing clinic location

### Admin Panel
- **Secure Login** – Admin authentication system
- **Dashboard** – Real-time stats (total, pending, approved, completed, cancelled, today's appointments)
- **Bookings by Service** – Visual chart showing appointment distribution
- **Appointment Management** – Search appointments and update status (Pending → Approved → Completed / Cancelled), with assigned doctor visible per booking
- **Doctor Management** – Add and remove doctors with specialty, experience, and profile icon

## 🛠️ Tech Stack

| Layer     | Technology                       |
|-----------|-----------------------------------|
| Frontend  | React, Vite, React Router         |
| Backend   | PHP                                |
| Database  | MySQL                              |
| Styling   | Custom CSS, inline styles, Poppins font |

## 📁 Project Structure