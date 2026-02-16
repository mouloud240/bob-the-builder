
# Product Requirements Document (PRD)

# FitTech – Connected Gym Management System

---

## 1. Document Information

* **Product Name:** FitTech
* **Product Type:** Connected Gym Management System
* **Institution:** École Supérieure en Informatique
* **Project Supervisors:**

  * Amar Bensaber
  * Bedjaoui Mohamed
  * Klouche Badia
  * Nemdili Amel

---

## 2. Product Overview

FitTech is a fully integrated management system for a modern connected gym. The platform consists of:

* A **mobile application** for members
* A **web interface** for coaches and administrators
* A **connected infrastructure layer** (NFC readers, sensors, connected machines)

The system enables subscription management, course reservations, activity tracking, staff management, notifications, equipment monitoring, and product sales.

---

## 3. Objectives

* Digitize gym operations end-to-end
* Improve member engagement and retention
* Provide personalized training insights
* Automate administrative processes
* Enable real-time activity and equipment tracking
* Increase revenue via subscriptions and product sales

---

## 4. Target Users

### 4.1 Members

* Subscribe to gym plans
* Book and manage courses
* Track performance and progress
* Communicate with coaches
* Purchase products

### 4.2 Coaches

* Manage courses and schedules
* Track member attendance
* Access health profiles
* Communicate with members

### 4.3 Administrators

* Manage members, coaches, and subscriptions
* Monitor financial and operational performance
* Generate reports
* Oversee equipment and product sales

---

## 5. Product Scope

### 5.1 Platforms

| Platform       | Users           | Purpose                          |
| -------------- | --------------- | -------------------------------- |
| Mobile App     | Members         | Booking, tracking, communication |
| Web Interface  | Coaches, Admins | Management & reporting           |
| Hardware Layer | All             | NFC access & connected tracking  |

---

## 6. Functional Requirements

---

## 6.1 Member & Subscription Management

### 6.1.1 Member Registration

**The system shall allow:**

* Creation of new member accounts
* Collection of:

  * First name
  * Last name
  * Date of birth
  * Email
  * Phone number
  * Profile photo
* Subscription selection
* Payment:

  * Online
  * On-site

---

### 6.1.2 Subscription Types

| Type        | Description                                      |
| ----------- | ------------------------------------------------ |
| Monthly     | Auto-renewable, cancel anytime                   |
| Annual      | 12-month commitment, full or installment payment |
| Per Session | Purchase session packs (e.g., 10 entries)        |
| Free Trial  | 1 session                                        |

---

### 6.1.3 Health Profile

Members may optionally define:

* Goals:

  * Weight loss
  * Muscle gain
  * Endurance
* Medical restrictions:

  * Back problems
  * Allergies
  * Other conditions

**Visibility:** Accessible by coaches for adaptation purposes.

---

### 6.1.4 Member Dashboard

Members shall be able to:

* View personal information
* View session history
* View invoices
* Pause subscription (max 2 months per year, medical reasons)

---

## 6.2 Course Reservation System

### 6.2.1 Course Creation (Coach)

Coaches shall define:

* Course type (e.g., Spinning, CrossFit)
* Max participants
* Date & time
* Duration
* Required level

---

### 6.2.2 Booking Rules

* Members can reserve up to **7 days in advance**
* If full:

  * Member can join waiting list
  * Automatic enrollment on cancellation
  * Automatic notification

---

### 6.2.3 Cancellation Policy

* Allowed up to **2 hours before course**
* After deadline:

  * Session deducted from subscription/pack
  * Member notified

---

### 6.2.4 Attendance Management

* Coach validates attendance via tablet
* If absent without cancellation:

  * Warning issued
  * After 3 warnings → Account suspended for 1 week

---

## 6.3 Access & Activity Tracking

### 6.3.1 Performance Dashboard

The mobile app shall display:

* Sessions per week
* Calories burned
* Goal progress
* Personalized recommendations

---

### 6.3.2 Connected Infrastructure

* NFC-based access control
* Machine activity tracking
* Sensor-based performance data collection

---

## 6.4 Staff Management

---

### 6.4.1 Coach Management

Each coach profile includes:

* Name
* Photo
* Specialties
* Biography

Coaches can:

* Manage schedule
* Create courses
* Access member health profiles

---

### 6.4.2 Administrator Capabilities

Administrators shall:

* Create/modify/suspend subscriptions
* Register/deactivate members
* Manage coach accounts
* Assign courses
* Generate financial reports:

  * Revenue
  * Attendance rate
  * Usage statistics

---

## 6.5 Notifications & Communication

### 6.5.1 Automated Notifications

System shall send:

* Course reminders (2 hours before)
* Goal achievement alerts
* Personalized offers
* Coach cancellation alerts

---

### 6.5.2 Internal Messaging

Members can:

* Send messages to coaches
* Request advice or clarifications

---

## 6.6 Equipment Management

The system shall:

* Track machine operational status
* Receive maintenance alerts from:

  * Members
  * Coaches
* Notify administrators of issues

---

## 6.7 Online Store

Integrated e-commerce system for:

* Supplements
* Clothing
* Fitness accessories

Features:

* Product listing
* Cart
* Checkout
* Payment processing

---

## 7. Non-Functional Requirements

### 7.1 Performance

* Support concurrent booking operations
* Real-time updates for waiting lists
* Low-latency dashboard rendering

### 7.2 Security

* Secure authentication & authorization
* Encrypted payment handling
* Role-based access control
* Protection of health data

### 7.3 Scalability

* Support growing member base
* Modular architecture

### 7.4 Availability

* 24/7 system uptime target
* Automated backups

### 7.5 Usability

* Mobile-first UX
* Responsive web design
* Intuitive booking process

---

## 8. Technical Stack

### Frontend

* Vue.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express

### Database

* MySQL

### Tools

* Git & GitHub
* Trello (Project Management)
* draw.io (Modeling & Design)

---

## 9. High-Level Architecture

```
Mobile App (Members)
        |
        | REST / API
        v
Backend (Node.js / Express)
        |
        | ORM / Queries
        v
MySQL Database
        |
        v
Connected Devices (NFC / Sensors)
```

---

## 10. Risks & Constraints

* Hardware integration complexity
* Real-time synchronization challenges
* Payment processing compliance
* Data privacy compliance for health data
* Enforcement of attendance policy

---

## 11. Development Plan

1. Requirements Analysis
2. System Design
3. Implementation
4. Testing & Validation
5. Final Report Documentation

---

## 12. Success Metrics

* Increase in member retention rate
* Reduction in no-show rate
* Subscription renewal rate
* Revenue growth
* Equipment downtime reduction

---

## 13. Future Enhancements

* AI-based workout recommendations
* Wearable device integration
* Loyalty rewards system
* Multi-branch support
* Advanced analytics dashboards

---

**End of PRD – FitTech Connected Gym System**

