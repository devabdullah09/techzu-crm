import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  Video,
  MapPin,
  Trash2,
  X,
  Save,
  Copy,
  ExternalLink,
  Users,
  FileText,
  Settings
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  contactName: string;
  contactEmail: string;
  company: string;
  type: "Call" | "Demo" | "Discovery" | "Follow-up" | "Proposal";
  date: string;
  time: string;
  duration: number; // in minutes
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "No Show";
  location: "Zoom" | "Google Meet" | "Phone" | "In Person" | "Teams";
  meetingLink?: string;
  notes?: string;
  campaignId?: string;
  agentName?: string;
  createdAt: string;
  reminder?: boolean;
}

const CalendarBooking = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Discovery Call with TechCorp",
      contactName: "John Smith",
      contactEmail: "john.smith@techcorp.com",
      company: "TechCorp Inc",
      type: "Discovery",
      date: "2024-01-16",
      time: "14:00",
      duration: 30,
      status: "Confirmed",
      location: "Zoom",
      meetingLink: "https://zoom.us/j/123456789",
      notes: "Discuss operational efficiency solutions",
      campaignId: "1",
      agentName: "Sales Pro AI",
      createdAt: "2024-01-15",
      reminder: true
    },
    {
      id: "2",
      title: "Product Demo - Healthcare Solutions",
      contactName: "Dr. Sarah Wilson",
      contactEmail: "sarah.wilson@healthclinic.com",
      company: "City Health Clinic",
      type: "Demo",
      date: "2024-01-17",
      time: "10:00",
      duration: 45,
      status: "Scheduled",
      location: "Google Meet",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      agentName: "Healthcare Specialist",
      createdAt: "2024-01-14",
      reminder: true
    },
    {
      id: "3",
      title: "Follow-up Call",
      contactName: "Michael Brown",
      contactEmail: "m.brown@startup.co",
      company: "StartupCo",
      type: "Follow-up",
      date: "2024-01-18",
      time: "16:30",
      duration: 15,
      status: "Scheduled",
      location: "Phone",
      notes: "Follow up on proposal discussion",
      createdAt: "2024-01-15"
    }
  ]);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMeetingDetail, setShowMeetingDetail] = useState<Meeting | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{date: string, time: string} | null>(null);
  const [bookingForm, setBookingForm] = useState({
    title: "",
    contactName: "",
    contactEmail: "",
    company: "",
    type: "Discovery" as Meeting["type"],
    duration: 30,
    location: "Zoom" as Meeting["location"],
    notes: "",
    reminder: true
  });

  // Generate time slots for calendar view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get meetings for current view
  const getMeetingsForDate = (date: string) => {
    return meetings.filter(meeting => meeting.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "Scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "Completed": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "No Show": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: Meeting["type"]) => {
    switch (type) {
      case "Discovery": return "bg-purple-500";
      case "Demo": return "bg-blue-500";
      case "Call": return "bg-green-500";
      case "Follow-up": return "bg-yellow-500";
      case "Proposal": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getLocationIcon = (location: Meeting["location"]) => {
    switch (location) {
      case "Zoom": return <Video size={14} />;
      case "Google Meet": return <Video size={14} />;
      case "Teams": return <Video size={14} />;
      case "Phone": return <Phone size={14} />;
      case "In Person": return <MapPin size={14} />;
      default: return <Video size={14} />;
    }
  };

  const handleTimeSlotClick = (date: string, time: string) => {
    // Check if slot is available
    const existingMeeting = meetings.find(m => m.date === date && m.time === time);
    if (!existingMeeting) {
      setSelectedTimeSlot({ date, time });
      setBookingForm({
        title: "",
        contactName: "",
        contactEmail: "",
        company: "",
        type: "Discovery",
        duration: 30,
        location: "Zoom",
        notes: "",
        reminder: true
      });
      setShowBookingModal(true);
    }
  };

  const handleCreateMeeting = () => {
    if (selectedTimeSlot) {
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        ...bookingForm,
        date: selectedTimeSlot.date,
        time: selectedTimeSlot.time,
        status: "Scheduled",
        meetingLink: bookingForm.location === "Zoom" ? "https://zoom.us/j/generated" : 
                     bookingForm.location === "Google Meet" ? "https://meet.google.com/generated" : undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setMeetings(prev => [...prev, newMeeting]);
      setShowBookingModal(false);
      setSelectedTimeSlot(null);
    }
  };

  const handleUpdateMeetingStatus = (meetingId: string, newStatus: Meeting["status"]) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId ? { ...meeting, status: newStatus } : meeting
    ));
  };

  const handleDeleteMeeting = (meetingId: string) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
    }
  };

  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const isSlotAvailable = (date: string, time: string) => {
    return !meetings.find(m => m.date === date && m.time === time);
  };

  return (
    <div className="calendar-booking">
      <div className="page-header">
        <div className="header-content">
          <h1>Calendar & Booking</h1>
          <p>Schedule and manage meetings with your leads</p>
        </div>
        <div className="header-actions">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === "day" ? "active" : ""}`}
              onClick={() => setViewMode("day")}
            >
              Day
            </button>
            <button
              className={`view-btn ${viewMode === "week" ? "active" : ""}`}
              onClick={() => setViewMode("week")}
            >
              Week
            </button>
            <button
              className={`view-btn ${viewMode === "month" ? "active" : ""}`}
              onClick={() => setViewMode("month")}
            >
              Month
            </button>
          </div>
          <button
            className="action-btn primary"
            onClick={() => setShowBookingModal(true)}
          >
            <Plus size={20} />
            New Booking
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-navigation">
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => navigateWeek("prev")}>
            <ChevronLeft size={20} />
          </button>
          <h2>
            {viewMode === "week" && (
              `Week of ${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`
            )}
          </h2>
          <button className="nav-btn" onClick={() => navigateWeek("next")}>
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          className="today-btn"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
      </div>

      {/* Week View Calendar */}
      {viewMode === "week" && (
        <div className="calendar-grid">
          <div className="calendar-header">
            <div className="time-column-header">Time</div>
            {weekDays.map((day, index) => (
              <div key={index} className="day-header">
                <div className="day-name">
                  {day.toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="day-number">
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="calendar-body">
            {timeSlots.map((time) => (
              <div key={time} className="time-row">
                <div className="time-label">{time}</div>
                {weekDays.map((day, dayIndex) => {
                  const dateStr = formatDate(day);
                  const meetingsAtTime = getMeetingsForDate(dateStr).filter(m => m.time === time);
                  const isAvailable = isSlotAvailable(dateStr, time);
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`time-slot ${isAvailable ? "available" : "occupied"}`}
                      onClick={() => isAvailable && handleTimeSlotClick(dateStr, time)}
                    >
                      {meetingsAtTime.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="meeting-block"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMeetingDetail(meeting);
                          }}
                        >
                          <div className="meeting-header">
                            <div
                              className={`meeting-type-indicator ${getTypeColor(meeting.type)}`}
                            ></div>
                            <span className="meeting-title">{meeting.title}</span>
                          </div>
                          <div className="meeting-details">
                            <div className="meeting-contact">
                              <User size={12} />
                              {meeting.contactName}
                            </div>
                            <div className="meeting-location">
                              {getLocationIcon(meeting.location)}
                              {meeting.location}
                            </div>
                          </div>
                          <span className={`meeting-status ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                      ))}
                      {isAvailable && (
                        <div className="available-slot">
                          <Plus size={16} />
                          <span>Available</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Meetings Sidebar */}
      <div className="upcoming-meetings">
        <h3>Upcoming Meetings</h3>
        <div className="meetings-list">
          {meetings
            .filter(m => new Date(m.date) >= new Date())
            .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
            .slice(0, 5)
            .map((meeting) => (
              <div
                key={meeting.id}
                className="meeting-card"
                onClick={() => setShowMeetingDetail(meeting)}
              >
                <div className="meeting-card-header">
                  <h4>{meeting.title}</h4>
                  <span className={`status-badge ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
                <div className="meeting-card-details">
                  <div className="detail-item">
                    <User size={14} />
                    <span>{meeting.contactName} - {meeting.company}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span>{meeting.date} at {meeting.time}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={14} />
                    <span>{meeting.duration} minutes</span>
                  </div>
                  <div className="detail-item">
                    {getLocationIcon(meeting.location)}
                    <span>{meeting.location}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* New Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule New Meeting</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Meeting Title</label>
                    <input
                      type="text"
                      value={bookingForm.title}
                      onChange={(e) => setBookingForm({...bookingForm, title: e.target.value})}
                      placeholder="e.g., Discovery Call with TechCorp"
                    />
                  </div>
                  <div className="form-group">
                    <label>Meeting Type</label>
                    <select
                      value={bookingForm.type}
                      onChange={(e) => setBookingForm({...bookingForm, type: e.target.value as Meeting["type"]})}
                    >
                      <option value="Discovery">Discovery Call</option>
                      <option value="Demo">Product Demo</option>
                      <option value="Call">Follow-up Call</option>
                      <option value="Proposal">Proposal Review</option>
                      <option value="Follow-up">General Follow-up</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      value={bookingForm.contactName}
                      onChange={(e) => setBookingForm({...bookingForm, contactName: e.target.value})}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={bookingForm.contactEmail}
                      onChange={(e) => setBookingForm({...bookingForm, contactEmail: e.target.value})}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={bookingForm.company}
                    onChange={(e) => setBookingForm({...bookingForm, company: e.target.value})}
                    placeholder="Company Name"
                  />
                </div>

                {selectedTimeSlot && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={selectedTimeSlot.date}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={selectedTimeSlot.time}
                        readOnly
                      />
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration</label>
                    <select
                      value={bookingForm.duration}
                      onChange={(e) => setBookingForm({...bookingForm, duration: parseInt(e.target.value)})}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <select
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({...bookingForm, location: e.target.value as Meeting["location"]})}
                    >
                      <option value="Zoom">Zoom</option>
                      <option value="Google Meet">Google Meet</option>
                      <option value="Teams">Microsoft Teams</option>
                      <option value="Phone">Phone Call</option>
                      <option value="In Person">In Person</option>
                    </select>
                  </div>

                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                    placeholder="Meeting agenda, preparation notes, etc."
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={bookingForm.reminder}
                      onChange={(e) => setBookingForm({...bookingForm, reminder: e.target.checked})}
                    />
                    Send reminder emails
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
              <button className="action-btn primary" onClick={handleCreateMeeting}>
                <Save size={16} />
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Detail Modal */}
      {showMeetingDetail && (
        <div className="modal-overlay" onClick={() => setShowMeetingDetail(null)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showMeetingDetail.title}</h3>
              <button onClick={() => setShowMeetingDetail(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="meeting-detail-view">
                <div className="meeting-overview">
                  <div className="overview-section">
                    <h4>Meeting Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <User size={16} />
                        <span><strong>Contact:</strong> {showMeetingDetail.contactName}</span>
                      </div>
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{showMeetingDetail.contactEmail}</span>
                      </div>
                      <div className="detail-item">
                        <Building size={16} />
                        <span><strong>Company:</strong> {showMeetingDetail.company}</span>
                      </div>
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span><strong>Date:</strong> {showMeetingDetail.date}</span>
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        <span><strong>Time:</strong> {showMeetingDetail.time} ({showMeetingDetail.duration} min)</span>
                      </div>
                      <div className="detail-item">
                        {getLocationIcon(showMeetingDetail.location)}
                        <span><strong>Location:</strong> {showMeetingDetail.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="status-section">
                    <h4>Status & Actions</h4>
                    <div className="status-controls">
                      <select
                        value={showMeetingDetail.status}
                        onChange={(e) => handleUpdateMeetingStatus(showMeetingDetail.id, e.target.value as Meeting["status"])}
                        className="status-selector"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No Show">No Show</option>
                      </select>
                      <button
                        className="action-btn danger small"
                        onClick={() => handleDeleteMeeting(showMeetingDetail.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {showMeetingDetail.meetingLink && (
                  <div className="meeting-link-section">
                    <h4>Join Meeting</h4>
                    <div className="link-container">
                      <input
                        type="text"
                        value={showMeetingDetail.meetingLink}
                        readOnly
                      />
                      <button
                        className="action-btn secondary small"
                        onClick={() => navigator.clipboard.writeText(showMeetingDetail.meetingLink!)}
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                      <button
                        className="action-btn primary small"
                        onClick={() => window.open(showMeetingDetail.meetingLink!, '_blank')}
                      >
                        <ExternalLink size={16} />
                        Join
                      </button>
                    </div>
                  </div>
                )}

                {showMeetingDetail.notes && (
                  <div className="notes-section">
                    <h4>Notes</h4>
                    <p>{showMeetingDetail.notes}</p>
                  </div>
                )}

                <div className="preparation-section">
                  <h4>Meeting Preparation</h4>
                  <div className="prep-actions">
                    <button className="action-btn secondary">
                      <FileText size={16} />
                      View Contact History
                    </button>
                    <button className="action-btn secondary">
                      <Users size={16} />
                      Company Research
                    </button>
                    <button className="action-btn secondary">
                      <Settings size={16} />
                      AI Meeting Prep
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarBooking;

