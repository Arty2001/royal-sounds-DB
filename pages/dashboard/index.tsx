// pages/dashboard.tsx

import { useEffect, useState } from 'react';

interface Quote {
  _id: string;
  name: string;
  emailAddress: string;
  eventType: string;
  eventDate: string;
}

const Dashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    fetch('/api/quotes')
      .then(response => response.json())
      .then(data => setQuotes(data))
      .catch(error => console.error('Error fetching quotes:', error));
  }, []);

  return (
    <div>
      <h1>Quotes Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Event Type</th>
            <th>Event Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map(quote => (
            <tr key={quote._id}>
              <td>{quote.name}</td>
              <td>{quote.emailAddress}</td>
              <td>{quote.eventType}</td>
              <td>{quote.eventDate}</td>
              <td>Edit | Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

