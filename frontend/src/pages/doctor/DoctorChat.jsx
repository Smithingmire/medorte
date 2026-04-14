import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import io from 'socket.io-client';
import api from '../../utils/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const DoctorChat = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socketURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    socketRef.current = io(socketURL);
    
    socketRef.current.on('connect', () => {
      if (user?._id) {
        socketRef.current.emit('join', user._id);
      }
    });

    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    const fetchMyPatients = async () => {
      try {
        const { data } = await api.get('/doctors/appointments');
        const validApps = data.filter(a => a && a.patient);
        const uniquePatients = Array.from(new Set(validApps.map(a => a.patient._id)))
          .map(id => validApps.find(a => a.patient._id === id).patient);
        setPatients(uniquePatients);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
    };
    fetchMyPatients();

    return () => socketRef.current.disconnect();
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      api.get(`/messages/${selectedPatient._id}`).then(({ data }) => {
        setMessages(data);
        scrollToBottom();
      });
    }
  }, [selectedPatient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedPatient) return;

    socketRef.current.emit('sendMessage', {
      sender: user._id,
      receiver: selectedPatient._id,
      text,
    });
    setText('');
  };

  return (
    <div className="flex h-[80vh] gap-4">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
        </CardHeader>
        <CardContent className="p-0 border-t border-[#E5E7EB]">
          <div className="overflow-y-auto h-[65vh]">
            {patients.map(patient => (
              <div 
                key={patient._id} 
                onClick={() => setSelectedPatient(patient)}
                className={`p-4 border-b border-[#E5E7EB] cursor-pointer transition-colors duration-200 flex items-center gap-3 ${
                  selectedPatient?._id === patient._id 
                    ? 'bg-blue-50 border-l-2 border-l-[#3A86FF]' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-md bg-[#3A86FF] flex items-center justify-center text-white font-bold uppercase text-sm">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-[#1F2933]">{patient.name}</p>
                  <p className="text-xs text-[#6B7280]">{patient.phone}</p>
                </div>
              </div>
            ))}
            {patients.length === 0 && <p className="p-4 text-[#6B7280] text-center text-sm">No active patients</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        {selectedPatient ? (
          <>
            <CardHeader className="bg-gray-50 border-b border-[#E5E7EB]">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#3A86FF] flex items-center justify-center text-white font-bold text-xs">
                  {selectedPatient.name.charAt(0)}
                </div>
                Chat with {selectedPatient.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, index) => {
                const isMe = msg.sender === user._id;
                return (
                  <div key={index} className={`flex w-max max-w-[70%] flex-col gap-2 rounded-lg px-4 py-2.5 text-sm ${
                    isMe 
                      ? 'ml-auto bg-[#3A86FF] text-white' 
                      : 'bg-gray-100 text-[#1F2933]'
                  }`}>
                    {msg.text}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t border-[#E5E7EB] bg-gray-50">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Type your message..." 
                  className="flex-1 m-0"
                />
                <Button type="submit">Send</Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#6B7280]">
            <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            Select a patient to start chatting
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorChat;
