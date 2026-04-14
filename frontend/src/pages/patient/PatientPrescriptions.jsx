import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import API_URL from '../../api';
import { Card, CardContent } from '../../components/ui/Card';
import { ClipboardList, Calendar, User, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/patients/prescriptions');
      setPrescriptions(data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-8 text-center text-[#6B7280]">
      <div className="w-8 h-8 border-2 border-[#3A86FF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      Loading prescriptions...
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 text-[#3A86FF] rounded-md">
          <ClipboardList className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F2933]">My Prescriptions</h1>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-[#3A86FF]" />
            </div>
            <p className="text-lg font-medium text-[#1F2933] mb-1">No Prescriptions Yet</p>
            <p className="text-[#6B7280]">You haven't received any prescriptions from a doctor yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((px) => (
            <Card key={px._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <div className="flex items-center gap-2 text-[#3A86FF] font-semibold mb-1">
                      <div className="w-6 h-6 rounded bg-[#3A86FF] flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      Dr. {px.doctor?.name}
                    </div>
                    <p className="text-sm text-[#6B7280]">{px.doctor?.specialization}</p>
                  </div>
                  <div className="text-right text-sm text-[#6B7280] flex items-center justify-end gap-1.5">
                    <Calendar className="w-4 h-4 text-[#3A86FF]" />
                    {new Date(px.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1F2933] mb-2 uppercase tracking-wide">Medicines</h4>
                    <ul className="space-y-2">
                      {px.medicines?.map((med, idx) => (
                        <li key={idx} className="bg-gray-50 p-3 rounded-md border border-[#E5E7EB] text-sm flex flex-col">
                          <span className="font-semibold text-[#1F2933]">{med.name}</span>
                          <span className="text-[#6B7280]">Dosage: {med.dosage} | Frequency: {med.frequency}</span>
                          <span className="text-[#6B7280]">Duration: {med.duration}</span>
                        </li>
                      ))}
                      {(!px.medicines || px.medicines.length === 0) && (
                        <p className="text-sm text-[#6B7280] italic">No specific medicines detailed.</p>
                      )}
                    </ul>
                  </div>

                  {px.notes && (
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mt-4">
                      <h4 className="text-sm font-semibold text-yellow-800 mb-1">Doctor's Notes</h4>
                      <p className="text-sm text-yellow-900">{px.notes}</p>
                    </div>
                  )}

                  {px.documentUrl && (
                    <div className="pt-4 mt-4 border-t border-[#E5E7EB]">
                      <a href={`${API_URL}${px.documentUrl}`} target="_blank" rel="noreferrer" className="text-[#3A86FF] hover:text-[#2b6fdc] text-sm font-medium flex items-center gap-1.5 transition-colors">
                        <FileText className="w-4 h-4" /> View Original Prescription PDF
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
