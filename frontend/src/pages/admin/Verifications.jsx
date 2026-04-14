import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Download } from 'lucide-react';

const Verifications = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchUnverified();
  }, []);

  const fetchUnverified = async () => {
    try {
      const { data } = await api.get('/admin/doctors/unverified');
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch unverified doctors');
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/admin/doctors/${id}/verify`, { status });
      toast.success(`Doctor ${status.toLowerCase()} successfully`);
      fetchUnverified();
    } catch (error) {
      toast.error('Failed to verify doctor');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1F2933]">Doctor Verifications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <Card key={doc._id}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-1 text-[#1F2933]">{doc.name}</h3>
              <p className="text-sm font-medium text-[#3A86FF] mb-2">{doc.specialization}</p>
              
              <div className="text-sm text-[#6B7280] mb-4 space-y-1">
                <p><strong className="text-[#1F2933]">Email:</strong> {doc.email}</p>
                <p><strong className="text-[#1F2933]">Phone:</strong> {doc.phone}</p>
                <p><strong className="text-[#1F2933]">License No:</strong> {doc.licenseNumber || 'N/A'}</p>
                <p><strong className="text-[#1F2933]">Clinic Address:</strong> {doc.clinicAddress || 'N/A'}</p>
              </div>

              {doc.degreeCertificateUrl && (
                <a 
                  href={`http://localhost:5000${doc.degreeCertificateUrl}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-[#E5E7EB] text-sm font-medium rounded-md text-[#1F2933] bg-white hover:bg-gray-50 mb-4 transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" /> View Certificate
                </a>
              )}

              <div className="flex gap-2">
                <Button className="w-1/2" onClick={() => handleVerify(doc._id, 'Verified')}>Approve</Button>
                <Button className="w-1/2" variant="danger" onClick={() => handleVerify(doc._id, 'Rejected')}>Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {doctors.length === 0 && (
          <p className="text-[#6B7280] col-span-full">No pending doctor verifications.</p>
        )}
      </div>
    </div>
  );
};

export default Verifications;
