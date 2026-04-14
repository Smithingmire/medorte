import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Users, Clock, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/doctors/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/doctors/appointments/${id}`, { status });
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const pending = appointments.filter(a => a.status === 'Pending').length;
  const accepted = appointments.filter(a => a.status === 'Accepted').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2933]">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-md bg-blue-50 text-[#3A86FF] mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Total Appointments</p>
              <h3 className="text-2xl font-bold text-[#1F2933]">{appointments.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-md bg-yellow-50 text-yellow-600 mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Pending Requests</p>
              <h3 className="text-2xl font-bold text-[#1F2933]">{pending}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-md bg-green-50 text-[#22C55E] mr-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Upcoming Consultations</p>
              <h3 className="text-2xl font-bold text-[#1F2933]">{accepted}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-[#6B7280]">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-[#3A86FF] font-bold text-xs">
                            {app.patient?.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-[#1F2933]">{app.patient?.name}</div>
                            <div className="text-sm text-[#6B7280]">{app.patient?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#1F2933]">{new Date(app.date).toLocaleDateString()}</div>
                        <div className="text-sm text-[#6B7280]">{app.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#6B7280] max-w-xs truncate">{app.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-[#6B7280]'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {app.status === 'Pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="success" onClick={() => handleUpdateStatus(app._id, 'Accepted')}>Accept</Button>
                            <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(app._id, 'Rejected')}>Reject</Button>
                          </div>
                        )}
                        {app.status === 'Accepted' && (
                          <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(app._id, 'Completed')}>Mark Completed</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
