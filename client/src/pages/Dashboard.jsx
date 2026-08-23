import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <>
      <Navbar />

      <h1>Dashboard</h1>

      <p>Welcome to CAMS.</p>

      <div>
        <h3>My Borrowed Assets</h3>
        <p>0 items</p>
      </div>

      <div>
        <h3>Pending Requests</h3>
        <p>0 requests</p>
      </div>

      <div>
        <h3>Upcoming Returns</h3>
        <p>No upcoming returns</p>
      </div>
    </>
  );
}

export default Dashboard;