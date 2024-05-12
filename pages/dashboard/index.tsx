import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Quote {
  _id: string;
  name: string;
  emailAddress: string;
  eventType: string;
  eventDate: string;
}

const Dashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/quotes')
      .then(response => response.json())
      .then(data => setQuotes(data))
      .catch(error => console.error('Error fetching quotes:', error));
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (status === "loading") {
    return <div>Loading or not authenticated...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quotes Dashboard</h1>
        {session && (
          <Button variant="contained" onClick={handleLogout}>Logout</Button>
        )}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map(quote => (
              <TableRow key={quote._id}>
                <TableCell>{quote.name}</TableCell>
                <TableCell>{quote.emailAddress}</TableCell>
                <TableCell>{quote.eventType}</TableCell>
                <TableCell>{quote.eventDate}</TableCell>
                <TableCell>Edit | Delete</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;