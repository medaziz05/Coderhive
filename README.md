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
