import React from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function PlaceholderAdminPage() {
  const location = useLocation();
  
  // Format the path to make it look like a nice title
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageName = pathParts[pathParts.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      padding: '3rem', 
      border: '1px solid #e5e7eb', 
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '60vh'
    }}>
      <div style={{ 
        backgroundColor: '#fef3c7', 
        color: '#d97706', 
        padding: '1rem', 
        borderRadius: '50%',
        marginBottom: '1.5rem'
      }}>
        <AlertCircle size={48} />
      </div>
      
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
        {pageName} Management
      </h2>
      
      <p style={{ fontSize: '1.1rem', color: '#4b5563', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
        This page layout has been successfully created. The backend integration and data management features for <strong>{pageName}</strong> will be implemented in the next phase of development.
      </p>
      
      <div style={{ marginTop: '2.5rem', padding: '1rem 2rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', color: '#374151', fontSize: '0.9rem' }}>
        Current Route: <code style={{ backgroundColor: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>{location.pathname}</code>
      </div>
    </div>
  );
}
