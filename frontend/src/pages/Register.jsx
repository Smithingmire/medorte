import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Heart } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'Patient',
    specialization: '', licenseNumber: '', clinicAddress: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let payload = { ...formData };

    try {
      if (formData.role === 'Doctor' && file) {
        const uploadData = new FormData();
        uploadData.append('document', file);
        const { data: uploadRes } = await api.post('/upload', uploadData);
        payload.degreeCertificateUrl = uploadRes.fileUrl;
      }

      const { data } = await api.post('/auth/register', payload);
      
      if (formData.role === 'Doctor') {
        toast.info('Registration complete. Awaiting Admin verification before you can log in.');
        navigate('/login');
      } else {
        login(data);
        toast.success('Registration successful');
        navigate('/patient/dashboard');
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg w-full my-8">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#3A86FF] flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-[#1F2933]">
            Join Medorte
          </CardTitle>
          <p className="text-sm text-[#6B7280] mt-1">Create your healthcare account</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="w-full mb-2">
              <label className="block text-sm font-medium text-[#1F2933] mb-1">I am registering as a</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="block w-full rounded-md border border-[#E5E7EB] bg-blue-50 focus:border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/20 sm:text-sm px-3 py-2 text-[#1F2933] font-medium transition-colors duration-200"
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
              <Input label="Phone Number" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 xxxxx" />
            </div>
            <Input label="Email address" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
            <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
            
            {formData.role === 'Doctor' && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-4 mt-4">
                <h3 className="font-medium text-[#3A86FF] text-sm flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#3A86FF] flex items-center justify-center">
                    <span className="text-white text-xs">+</span>
                  </div>
                  Professional Details
                </h3>
                <Input label="Specialization" name="specialization" required placeholder="e.g. Cardiologist" value={formData.specialization} onChange={handleChange} />
                <Input label="License Number" name="licenseNumber" required placeholder="Medical License ID" value={formData.licenseNumber} onChange={handleChange} />
                <Input label="Clinic/Hospital Address" name="clinicAddress" required value={formData.clinicAddress} onChange={handleChange} />
                
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-1">Degree Certificate / License Document</label>
                  <input 
                    type="file" 
                    required 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-[#6B7280] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#3A86FF] file:text-white hover:file:bg-[#2b6fdc] file:transition-colors file:duration-200 file:cursor-pointer"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">Accepts PDF, JPG, PNG up to 10MB.</p>
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Create Account
            </Button>
            
            <div className="text-center text-sm mt-4">
              <span className="text-[#6B7280]">Already have an account? </span>
              <Link to="/login" className="font-medium text-[#3A86FF] hover:text-[#2b6fdc] transition-colors">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
