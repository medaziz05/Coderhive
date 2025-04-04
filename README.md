# 🖥️ Backend – Course Management Platform

This is the Spring Boot backend for the Course Management Platform. It provides REST APIs to manage:

- Courses
- Chapters
- Attachments

---

## ⚙️ Technologies Used

- Spring Boot
- LibreOffice – for file conversion to PDF
- Multipart File Upload
- Spring MVC / REST API
- CORS enabled for Angular communication

---

## 📦 Features

### 🔧 Courses

- Create courses with image uploads
- Edit, delete, and list all courses
- Images supported: .png, .jpg, .jpeg, .webp, etc.

### 📖 Chapters

- Add chapters to a specific course
- Update, delete, and fetch chapter list by course

### 📎 Attachments

- Add, edit, delete, and preview attachments
- Supports: .pdf, .txt, .doc, .docx, .ppt
- Files are automatically converted to PDF using LibreOffice

---

## ✅ Form Validation Rules (Contrôle de saisie)

- All fields must have minimum 3 characters
- Fields cannot be left empty
- Negative numbers are not allowed
- Numeric fields accept only correct types:
  - Integer-only fields → no decimals allowed
  - Float fields → accept decimal values (e.g., 3.5)
- Fields have maximum character lengths depending on type:
  - Shorter limit for titles, longer for descriptions

---

## 🛠 Setup & Installation

Make sure Java 17 and Spring Boot are installed.  
Install LibreOffice:

In PowerShell (as Administrator):

Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = `
[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

choco install libreoffice-fresh

Run backend server:

./mvnw spring-boot:run

---

## 📂 Folder Permission for Uploads

To enable the server to store and serve attachments:

In CMD (as administrator):

icacls "C:\Users\MSI\Desktop\course-management\uploads" /grant Everyone:F /T /C /Q

---

## 🔗 REST API Endpoints

Courses:  
POST    /api/courses  
GET     /api/courses  
PUT     /api/courses/{id}  
DELETE  /api/courses/{id}  

Chapters:  
POST    /api/chapters  
GET     /api/chapters/by-course/{courseId}  
PUT     /api/chapters/{id}  
DELETE  /api/chapters/{id}  

Attachments:  
POST    /api/attachments


# 📘 Frontend – Course Management Platform

This is the Angular frontend of the Course Management Platform. It provides two main user interfaces:

- 👨‍🏫 Teacher interface – Full content management (Courses, Chapters, Attachments)
- 👨‍🎓 Student interface – Read-only view of courses and chapters

---

## ⚙️ Technologies Used

- Angular
- Swiper.js – for chapter navigation/swiping
- pdfjs-dist – for PDF rendering inside an iframe
- LibreOffice (Backend-side) – used to convert files to PDF for frontend viewing

---

## 🧑‍🏫 Features for Teachers

- Full CRUD for Courses (with image upload)
- Full CRUD for Chapters (linked to specific courses)
- Full CRUD for Attachments (can preview files as PDF)
- Attachments supported: .pdf, .txt, .doc, .docx, .ppt
- Course images supported: all formats, including .webp
- Dynamic updates and deletions (no page reload)
- Smart update: existing values are preloaded
- Partial update: only change the fields you need

---

## 🧑‍🎓 Features for Students

- View available Courses
- View Chapters per course
- Read Attachments via embedded PDF viewer (iframe)

---

## ✅ Form Validation ("Contrôle de saisie")

- No empty fields allowed
- Minimum of 3 characters per field
- Maximum character limits based on field logic:
  - Title: Shorter max
  - Description: Larger max
- No negative numbers
- Correct input types:
  - Fields expecting integers do not accept decimals
  - Fields expecting floats accept decimal numbers like 1.2
- You can click Update without modifying any field (no errors)
- You can update only one field without touching the others

---

## 🛠 Installation & Setup

npm install  
npm install pdfjs-dist  
npm install swiper@8.4.5  
ng serve  

---

## 🔐 File Access & Permissions

In CMD (as administrator):

icacls "C:\Users\MSI\Desktop\course-management\uploads" /grant Everyone:F /T /C /Q

---

## 💡 Notes

- All uploaded files are converted to PDF using LibreOffice on the backend.
- Frontend only fetches and renders PDFs.

