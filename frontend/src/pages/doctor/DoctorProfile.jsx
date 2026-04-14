import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Settings, Clock, Sun, Coffee } from 'lucide-react';

const DoctorProfile = () => {
  const [profileData, setProfileData] = useState({
    clinicStartTime: '09:00',
    clinicEndTime: '17:00',
    lunchStartTime: '13:00',
    lunchEndTime: '14:00',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setProfileData({
          clinicStartTime: data.clinicStartTime || '09:00',
          clinicEndTime: data.clinicEndTime || '17:00',
          lunchStartTime: data.lunchStartTime || '13:00',
          lunchEndTime: data.lunchEndTime || '14:00',
        });
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/doctors/profile', profileData);
      toast.success('Profile timings updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 text-[#3A86FF] rounded-md">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F2933]">Profile & Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-[#3A86FF]" /> Working Hours Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-4">
              <h3 className="font-medium text-[#3A86FF] text-sm flex items-center gap-2">
                <Sun className="w-4 h-4" /> Shift Timings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Start Time" 
                  type="time" 
                  name="clinicStartTime" 
                  value={profileData.clinicStartTime} 
                  onChange={handleChange} 
                  required 
                />
                <Input 
                  label="End Time" 
                  type="time" 
                  name="clinicEndTime" 
                  value={profileData.clinicEndTime} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg space-y-4">
              <h3 className="font-medium text-yellow-700 text-sm flex items-center gap-2">
                <Coffee className="w-4 h-4" /> Lunch Break
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Lunch Start" 
                  type="time" 
                  name="lunchStartTime" 
                  value={profileData.lunchStartTime} 
                  onChange={handleChange} 
                  required 
                />
                <Input 
                  label="Lunch End" 
                  type="time" 
                  name="lunchEndTime" 
                  value={profileData.lunchEndTime} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfile;
