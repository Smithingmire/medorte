import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/patients/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1F2933]">My Appointments</h1>
        <Button onClick={() => navigate('/patient/search')}>
          <Search className="w-4 h-4 mr-2" /> Book New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-[#3A86FF]" />
              </div>
              <p className="text-[#6B7280] mb-4">You have no booked appointments yet.</p>
              <Button onClick={() => navigate('/patient/search')}>Find a Doctor</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map(app => (
                <div key={app._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md border border-[#E5E7EB] hover:bg-white transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-[#3A86FF] font-bold text-sm">
                      {app.doctor?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2933]">Dr. {app.doctor?.name}</p>
                      <p className="text-sm text-[#6B7280]">{app.doctor?.specialization}</p>
                      <p className="text-sm text-[#6B7280] mt-0.5"><span className="font-medium text-[#1F2933]">Reason:</span> {app.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#1F2933]">{new Date(app.date).toLocaleDateString()}</p>
                    <p className="text-sm text-[#6B7280]">{app.timeSlot}</p>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 text-xs font-medium rounded-full ${
                      app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-[#6B7280]'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAppointments;
