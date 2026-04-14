import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import api from '../../utils/api';
import { Calendar } from 'lucide-react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/patients/appointments');
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2933]">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-md bg-blue-50 text-[#3A86FF] mr-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Appointments</p>
              <h3 className="text-2xl font-bold text-[#1F2933]">{appointments.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-[#6B7280]">No appointments found.</p>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map(app => (
                <div key={app._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md border border-[#E5E7EB] hover:bg-white transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-[#3A86FF] font-bold text-sm">
                      {app.doctor?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2933]">Dr. {app.doctor?.name}</p>
                      <p className="text-sm text-[#6B7280]">{app.doctor?.specialization}</p>
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

export default PatientDashboard;
