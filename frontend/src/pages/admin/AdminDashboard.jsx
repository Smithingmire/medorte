import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Activity, Users as UsersIcon, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2933]">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-md bg-blue-50 text-[#3A86FF] mr-4">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Patients Registered</p>
              <h3 className="text-2xl font-bold text-[#1F2933]">{stats.patients}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-md bg-green-50 text-[#22C55E] mr-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Doctors Verified</p>
              <h3 className="text-2xl font-bold text-[#1F2933]">{stats.doctors}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-md bg-purple-50 text-purple-600 mr-4">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Total Appointments</p>
              <h3 className="text-2xl font-bold text-[#1F2933]">{stats.appointments}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
