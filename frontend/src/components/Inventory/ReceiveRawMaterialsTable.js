import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReceiveRawMaterialsTable() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const navigate = useNavigate();

  // Fetch Raw Materials function
  const fetchRawMaterials = async () => {
    try {
      const response = await fetch('http://localhost:8070/receiveRawMaterialsRoutes/receive-raw-materials');
      if (response.ok) {
        const data = await response.json();
        setRawMaterials(data);
      } else {
        console.error('Failed to fetch raw materials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Call fetchRawMaterials on component mount
  useEffect(() => {
    fetchRawMaterials();
  }, []);

  // Function to handle updating a raw material entry
  const handleUpdate = (material) => {
    navigate('/dashdecerawform', { state: { material } });
  };

  // Function to handle deleting a raw material entry
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8070/receiveRawMaterialsRoutes/delete-receive/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRawMaterials(); // Refresh the table after deletion
        alert('Raw material entry deleted successfully');
      } else {
        alert('Failed to delete raw material entry');
      }
    } catch (error) {
      console.error('Error deleting raw material entry:', error);
      alert('An error occurred while deleting the entry.');
    }
  };

  // Filter raw materials based on search term for stock type
  const filteredMaterials = rawMaterials.filter(material =>
    material.stockType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Received Raw Materials Details</h1>
      
      {/* Search input */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Stock Type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on input change
          style={{
            padding: '8px',
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
          }}
        />
      </div>

      {filteredMaterials.length === 0 ? (
        <p>No raw materials available.</p>
      ) : (
        <table style={{ width: '90%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '14px', margin: '0 auto' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', color: '#333' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stock Number</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stock Type</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Receive Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', width: '170px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((material) => (
              <tr key={material._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{material.stockNumber}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{material.stockType}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(material.receiveDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{material.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleUpdate(material)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '6px',
                      fontSize: '12px'
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
