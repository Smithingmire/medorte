import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search, MapPin, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [apptData, setApptData] = useState({ date: '', timeSlot: '10:00 AM - 10:30 AM', reason: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/patients/doctors?specialization=${query}`);
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(searchTerm);
  };

  const generateTimeSlots = (doc) => {
    if (!doc) return [];
    const slots = [];
    const start = doc.clinicStartTime || '09:00';
    const end = doc.clinicEndTime || '17:00';
    const lunchStart = doc.lunchStartTime || '13:00';
    const lunchEnd = doc.lunchEndTime || '14:00';

    const parseTime = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const formatTime = (totalMins) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    let current = parseTime(start);
    const endMins = parseTime(end);
    const lsMins = parseTime(lunchStart);
    const leMins = parseTime(lunchEnd);

    while (current + 30 <= endMins) {
      if (current >= lsMins && current < leMins) {
        current = leMins;
        continue;
      }
      const slotStart = formatTime(current);
      const slotEnd = formatTime(current + 30);
      slots.push(`${slotStart} - ${slotEnd}`);
      current += 30;
    }
    return slots;
  };

  const availableSlots = selectedDoctor ? generateTimeSlots(selectedDoctor) : [];

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    const slots = generateTimeSlots(doctor);
    setApptData({ date: '', timeSlot: slots[0] || '', reason: '' });
    setShowModal(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients/appointments', {
        doctorId: selectedDoctor._id,
        date: apptData.date,
        timeSlot: apptData.timeSlot,
        reason: apptData.reason,
      });
      toast.success('Appointment requested successfully');
      setShowModal(false);
      setApptData({ date: '', timeSlot: '', reason: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2933]">Find Doctors</h1>
      
      <form onSubmit={handleSearch} className="flex gap-4">
        <Input 
          className="max-w-md" 
          placeholder="Search by specialization (e.g., Cardiologist)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" isLoading={loading}>
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <Card key={doc._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-[#3A86FF] flex items-center justify-center text-white font-bold text-lg">
                    {doc.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#1F2933]">Dr. {doc.name}</h3>
                    <p className="text-[#2EC4B6] font-medium text-sm">{doc.specialization || 'General Practitioner'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-[#6B7280] mb-6 text-sm">
                <MapPin className="w-4 h-4 mr-1.5 text-[#3A86FF]" />
                {doc.clinicAddress || 'Virtual Consultations Available'}
              </div>
              <Button className="w-full" onClick={() => openModal(doc)}>
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ))}
        {doctors.length === 0 && !loading && (
          <p className="text-[#6B7280] col-span-full text-center py-8">No doctors found matching your criteria.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md m-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-1 text-[#1F2933]">Book with Dr. {selectedDoctor?.name}</h2>
              <p className="text-sm text-[#6B7280] mb-5">Fill in the details to request an appointment</p>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={apptData.date}
                      onChange={(e) => setApptData({...apptData, date: e.target.value})}
                      className="pl-10 block w-full rounded-md border border-[#E5E7EB] bg-white focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 sm:text-sm px-3 py-2 transition-colors duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-1">Time Slot</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <select 
                      value={apptData.timeSlot}
                      onChange={(e) => setApptData({...apptData, timeSlot: e.target.value})}
                      className="pl-10 block w-full rounded-md border border-[#E5E7EB] bg-white focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 sm:text-sm px-3 py-2 transition-colors duration-200"
                    >
                      {availableSlots.length > 0 ? (
                        availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))
                      ) : (
                        <option value="" disabled>No slots available</option>
                      )}
                    </select>
                  </div>
                </div>

                <Input 
                  label="Reason for Visit" 
                  required 
                  placeholder="E.g., General Checkup, Fever..." 
                  value={apptData.reason}
                  onChange={(e) => setApptData({...apptData, reason: e.target.value})}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit">Confirm Booking</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchDoctors;
