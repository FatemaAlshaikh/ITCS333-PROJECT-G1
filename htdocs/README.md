# Campus Hub API Documentation
Overview
The Campus Hub API allows administrators to manage university events, while students and attendees can browse and register for events. It supports full CRUD operations, search and filtering, image upload, and data validation.
________________________________________
Technologies Used
•	PHP (Procedural)
•	MySQL / MariaDB
•	PDO for secure DB interaction
•	JSON for data exchange
•	Replit for backend hosting
________________________________________
Database Schema
events Table
Column	Type	Description
id	INT AUTO_INCREMENT	Primary key
name	VARCHAR(255)	Event name
date	DATE	Date (YYYY-MM-DD)
time	TIME	Time (HH:MM:SS)
type	VARCHAR(50)	Category (e.g. Workshop, Seminar)
contact_info	VARCHAR(255)	Organizer’s contact details
image_path	VARCHAR(255)	Image file path
description	TEXT	Event details
created_at	TIMESTAMP	Created timestamp (auto-filled)
attendees Table
Column	Type	Description
id	INT AUTO_INCREMENT	Primary key
name	VARCHAR(255)	Attendee's name
email	VARCHAR(255)	Email address
phone	VARCHAR(20)	Contact number
event_id	INT	ID of the event registered for
comments	TEXT	Optional comments
created_at	TIMESTAMP	Timestamp of registration
________________________________________
API Endpoints
1. Add Event
•	Method: POST
•	Endpoint: /api.php?action=add_event
•	Headers: Content-Type: multipart/form-data
•	Description: Creates a new event
Parameters (Form Data)
Name	Type	Required	Description
event-name	string		Event title
event-date	string		Format: YYYY-MM-DD
event-time	string		Format: HH:MM:SS
event-type	string		Event category
contact-info	string	Organizer’s contact info
event-description	string		Full description
event-image	file		JPG/PNG image (max 2MB)
Example Response
{
  "status": "success",
  "message": "Event created successfully"
}
________________________________________
2. Get All Events
•	Method: GET
•	Endpoint: /api.php?action=get_events
•	Description: Retrieves events (with optional filtering & pagination)
Query Parameters
Name	  Type	      Required	Description
limit	  int	        Number of events (default: 10)
offset	int	     	  Pagination offset
type	  string	   	Filter by event type
date	  string	    Filter by event date (YYYY-MM-DD)
________________________________________
3. Get Event by ID
•	Method: GET
•	Endpoint: /api.php?action=get_event&id={event_id}
Query Parameter
•	id (int): Event ID
________________________________________
4. Update Event
•	Method: PUT
•	Endpoint: /api.php?action=update_event
•	Headers: Content-Type: application/json
JSON Body
{
  "id": 3,
  "name": "Updated Name",
  "date": "2025-05-22",
  "time": "11:00:00",
  "type": "Seminar",
  "contact": "new@email.com",
  "description": "Updated description"
}
________________________________________
5. Delete Event
•	Method: DELETE
•	Endpoint: /api.php?action=delete_event&id={event_id}
________________________________________
6. Search Events
•	Method: GET
•	Endpoint: /api.php?action=search_events&keyword=example
________________________________________
7. Register Attendee
•	Method: POST
•	Endpoint: /api.php?action=register_attendee
•	Headers: Content-Type: application/json
JSON Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "event": 1,
  "comments": "Looking forward to the event!"
}
Example Response
{
  "status": "success",
  "message": "Registered successfully"
}
________________________________________
8. Get Attendees for Event
•	Method: GET
•	Endpoint: /api.php?action=get_attendees&event_id=1
________________________________________
Security & Validation
•	Input validation & sanitization
•	SQL injection prevention (PDO)
•	File upload protection
•	Authentication not implemented (planned)
________________________________________
Error Handling (Standardized)
HTTP Code	Meaning	Trigger
200	OK	Successful request
400	Bad Request	Missing or invalid parameters
404	Not Found	Resource doesn't exist
405	Method Not Allowed	Unsupported method
422	Unprocessable Entity	Required fields missing
500	Internal Server Error	Server or database failure
________________________________________
Standard API Response Format
{
  "status": "success" | "error",
  "message": "Descriptive message",
  "data": { ... } | [ ... ] | null
}