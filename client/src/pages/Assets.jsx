import Navbar from "../components/Navbar";

function Assets() {
  return (
    <>
      <Navbar />

      <h1>Assets</h1>

      <p>Browse available campus assets.</p>

      <div>
        <h3>Arduino Uno</h3>
        <p>Category: Electronics</p>
        <p>Status: Available</p>
        <button>Request</button>
      </div>

      <div>
        <h3>Oscilloscope</h3>
        <p>Category: Laboratory Equipment</p>
        <p>Status: Available</p>
        <button>Request</button>
      </div>
    </>
  );
}

export default Assets;