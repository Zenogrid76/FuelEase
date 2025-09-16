//HomePage
import React from 'react';

function HomePage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Banner Section */}
      <section style={{
        textAlign: 'center',
        padding: '80px 20px',
        backgroundColor: '#e8f0fe',
        color: 'black'
      }}>
        <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Welcome to Fuelease</h2>
        <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Manage your project efficiently with Fuelease. Track tasks, monitor progress, and collaborate seamlessly.
        </p>
        <button style={{
          backgroundColor: '#040b1369',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '18px',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        padding: '60px 20px'
      }}>
        <div style={{
          backgroundColor: '#dcdcdc',
          padding: '30px',
          margin: '15px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          flex: '1 1 250px',
          textAlign: 'center',
          color: 'black'
        }}>
          <h3>Task Management</h3>
          <p>Easily organize and assign tasks with real-time updates.</p>
        </div>
        <div style={{
          backgroundColor: '#dcdcdc',
          padding: '30px',
          margin: '15px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          flex: '1 1 250px',
          textAlign: 'center',
          color: 'black'
        }}>
          <h3>Collaboration</h3>
          <p>Work together with your team seamlessly from anywhere.</p>
        </div>
        <div style={{
          backgroundColor: '#dcdcdc',
          padding: '30px',
          margin: '15px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          flex: '1 1 250px',
          textAlign: 'center',
          color: 'black'
        }}>
          <h3>Progress Tracking</h3>
          <p>Monitor the progress of your project with visual dashboards.</p>
        </div>
      </section>

      
    </div>
  );
}

export default HomePage;
