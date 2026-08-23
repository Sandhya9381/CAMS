


import { useState, useEffect } from "react";

import "./App.css";
import Notifications from "./Notifications";


// ==================================================
// APP
// ==================================================

function App() {

  const [showSignup, setShowSignup] = useState(false);

  const [showAssets, setShowAssets] = useState(false);

  const [showRequests, setShowRequests] = useState(false);

  const [showAdminRequests, setShowAdminRequests] =
    useState(false);

  const [showBorrowedAssets, setShowBorrowedAssets] =
    useState(false);
const [notifications, setNotification] = useState({
  message: "",
  type: "success"
});

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

const showNotification = (
  message,
  type = "success",
  onClose = null
) => {

  setNotification({
    message,
    type
  });

};
  // ==================================================
  // LOGGED-IN USER
  // ==================================================

  if (token && storedUser) {

    const user = JSON.parse(storedUser);


    // ------------------------------------------
    // Asset Management
    // ------------------------------------------

    if (showAssets) {

      return (
        <AssetManagement
          user={user}
          onBack={() => setShowAssets(false)}
        />
      );

    }


    // ------------------------------------------
    // My Requests
    // ------------------------------------------

    if (showRequests) {

      return (
        <MyRequests
          user={user}
          onBack={() => setShowRequests(false)}
        />
      );

    }


    // ------------------------------------------
    // Admin Requests
    // ------------------------------------------

    if (showAdminRequests) {

      return (
        <AdminRequests
          user={user}
          onBack={() => setShowAdminRequests(false)}
        />
      );

    }


    // ------------------------------------------
    // Borrowed Assets
    // ------------------------------------------

    if (showBorrowedAssets) {

      return (
        <BorrowedAssets
          user={user}
          onBack={() => setShowBorrowedAssets(false)}
        />
      );

    }


    // ------------------------------------------
    // Dashboard
    // ------------------------------------------

    return (
      <Dashboard
        user={user}

        onViewAssets={() =>
          setShowAssets(true)
        }

        onViewRequests={() =>
          setShowRequests(true)
        }

        onViewAdminRequests={() =>
          setShowAdminRequests(true)
        }

        onViewBorrowedAssets={() =>
          setShowBorrowedAssets(true)
        }
        showNotification={showNotification}
      />
    );

  }


  // ==================================================
  // LOGIN / SIGNUP
  // ==================================================

  return (

    <div>

      {showSignup ? (

        <Signup
          onBackToLogin={() =>
            setShowSignup(false)
          }
          showNotification={showNotification}
        />

      ) : (

        <Login
          onSignup={() =>
            setShowSignup(true)
          }
          showNotification={showNotification}
        />

      )}

    </div>

  );

}


// ==================================================
// LOGIN
// ==================================================


// ==================================================
// LOGIN
// ==================================================

// ==================================================
// LOGIN
// ==================================================

function Login({ onSignup, showNotification }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message);
        return;

      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      showNotification(
        "Login successful! Welcome to CAMS.",
        "success"
      );

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert("Unable to connect to server");

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          CAMS
        </div>

        <p className="auth-subtitle">
          Campus Asset Management System
        </p>

        <h1>
          Welcome back
        </h1>

        <p className="auth-description">
          Sign in to manage your campus resources.
        </p>


        <form onSubmit={handleLogin}>

          <div className="auth-field">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            className="auth-button"
          >
            Sign In →
          </button>

        </form>


        <div className="auth-divider">
          <span>Don't have an account?</span>
        </div>


        <button
          className="auth-secondary-button"
          onClick={onSignup}
        >
          Create an account
        </button>

      </div>

    </div>

  );

}

// ==================================================
// SIGNUP
// ==================================================

// ==================================================
// SIGNUP
// ==================================================

function Signup({ onBackToLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");


  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name: name,
            email: email,
            password: password,
            role: "student",
            department: department

          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.message);
        return;

      }


      alert(
        "Account created successfully!"
      );

      onBackToLogin();


    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to server"
      );

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          CAMS
        </div>

        <p className="auth-subtitle">
          Campus Asset Management System
        </p>

        <h1>
          Create your account
        </h1>

        <p className="auth-description">
          Join CAMS to access campus resources.
        </p>


        <form onSubmit={handleSignup}>


          <div className="auth-field">

            <label>
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-field">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-field">

            <label>
              Department
            </label>

            <input
              type="text"
              placeholder="e.g. ECE"
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            className="auth-button"
          >
            Create Account →
          </button>

        </form>


        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>


        <button
          className="auth-secondary-button"
          onClick={onBackToLogin}
        >
          Back to Sign In
        </button>

      </div>

    </div>

  );

}
   
// DASHBOARD ROUTER
// ==================================================

function Dashboard({
  user,
  onViewAssets,
  onViewRequests,
  onViewAdminRequests,
  onViewBorrowedAssets
}) {

  if (user.role === "admin") {

    return (
      <AdminDashboard
        user={user}
        onViewAssets={onViewAssets}
        onViewAdminRequests={onViewAdminRequests}
        onViewBorrowedAssets={onViewBorrowedAssets}
      />
    );

  }

  return (
    <StudentDashboard
      user={user}
      onViewAssets={onViewAssets}
      onViewRequests={onViewRequests}
      onViewBorrowedAssets={onViewBorrowedAssets}
    />
  );
}
// ==================================================
// ADMIN DASHBOARD
// ==================================================

// ==================================================
// ADMIN DASHBOARD
// ==================================================

function AdminDashboard({
  user,
  onViewAssets,
  onViewAdminRequests,
  onViewBorrowedAssets
}) {

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();

  };


  return (

    <div className="cams-page">

      {/* ================================
          TOP NAVBAR
      ================================= */}

      <nav className="cams-navbar">

        <div className="cams-logo">
          CAMS
        </div>


        <div className="cams-user-area">

          <div style={{ textAlign: "right" }}>

            <div className="cams-user-name">
              {user.name}
            </div>

            <div className="cams-role">
              Administrator
            </div>

          </div>


          <div className="user-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "A"}
          </div>

        </div>

      </nav>


      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="cams-content">


        {/* PAGE HEADER */}

        <div className="cams-page-header">

          <p className="dashboard-greeting">
            ADMIN PORTAL
          </p>

          <h1>
            Welcome back, {user.name}
          </h1>

          <p>
            Manage campus assets, student requests,
            and currently borrowed equipment.
          </p>

        </div>


        {/* ================================
            ADMIN QUICK ACTIONS
        ================================= */}

        <div className="dashboard-grid">


          {/* MANAGE ASSETS */}

          <div
            className="dashboard-action-card"
            onClick={onViewAssets}
          >

            <div className="dashboard-icon asset-icon">
              📦
            </div>

            <h3>
              Asset Management
            </h3>

            <p>
              Add new campus assets, update asset
              information, and manage available
              equipment.
            </p>

            <button className="cams-button">

              Manage Assets
              <span> →</span>

            </button>

          </div>


          {/* REQUEST MANAGEMENT */}

          <div
            className="dashboard-action-card"
            onClick={onViewAdminRequests}
          >

            <div className="dashboard-icon request-icon">
              📋
            </div>

            <h3>
              Asset Requests
            </h3>

            <p>
              Review student requests and approve
              or reject pending asset requests.
            </p>

            <button className="cams-button secondary">

              Manage Requests
              <span> →</span>

            </button>

          </div>


          {/* BORROWED ASSETS */}

          <div
            className="dashboard-action-card"
            onClick={onViewBorrowedAssets}
          >

            <div className="dashboard-icon borrowed-icon">
              🎒
            </div>

            <h3>
              Borrowed Assets
            </h3>

            <p>
              View all equipment currently borrowed
              by students and monitor active loans.
            </p>

            <button className="cams-button secondary">

              View Borrowed Assets
              <span> →</span>

            </button>

          </div>


        </div>


        {/* ================================
            ADMIN INFORMATION
        ================================= */}

        <div className="dashboard-info-card">

          <div>

            <span className="info-label">
              ADMINISTRATOR
            </span>

            <h3>
              {user.department || "Campus Administration"}
            </h3>

            <p>
              You have administrative access to
              manage campus resources and student
              asset requests.
            </p>

          </div>


          <div className="department-badge">
            Admin
          </div>

        </div>


        {/* ================================
            LOGOUT
        ================================= */}

        <div className="dashboard-footer">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </main>

    </div>

  );

}


// ==================================================
// STUDENT DASHBOARD
// ==================================================


// 

// ==================================================
// STUDENT DASHBOARD
// ==================================================

function StudentDashboard({
  user,
  onViewAssets,
  onViewRequests,
  onViewBorrowedAssets
}) {

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();

  };


  return (

    <div className="cams-page">

      {/* ================================
          TOP NAVBAR
      ================================= */}

      <nav className="cams-navbar">

        <div className="cams-logo">
          CAMS
        </div>


        <div className="cams-user-area">

          <div style={{ textAlign: "right" }}>

            <div className="cams-user-name">
              {user.name}
            </div>

            <div className="cams-role">
              Student
            </div>

          </div>


          <div className="user-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "S"}
          </div>

        </div>

      </nav>


      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="cams-content">


        {/* PAGE HEADER */}

        <div className="cams-page-header">

          <p className="dashboard-greeting">
            Welcome back 👋
          </p>

          <h1>
            Good to see you, {user.name}
          </h1>

          <p>
            Manage your campus assets, requests,
            and borrowed equipment from one place.
          </p>

        </div>


        {/* ================================
            QUICK ACTIONS
        ================================= */}

        <div className="dashboard-grid">


          {/* AVAILABLE ASSETS */}

          <div
            className="dashboard-action-card"
            onClick={onViewAssets}
          >

            <div className="dashboard-icon asset-icon">
              📦
            </div>

            <h3>
              Browse Assets
            </h3>

            <p>
              Explore available campus equipment
              and request the assets you need.
            </p>

            <button className="cams-button">

              View Available Assets
              <span> →</span>

            </button>

          </div>


          {/* MY REQUESTS */}

          <div
            className="dashboard-action-card"
            onClick={onViewRequests}
          >

            <div className="dashboard-icon request-icon">
              📋
            </div>

            <h3>
              My Requests
            </h3>

            <p>
              Track your asset requests and
              see their current status.
            </p>

            <button className="cams-button secondary">

              View My Requests
              <span> →</span>

            </button>

          </div>


          {/* BORROWED ASSETS */}

          <div
            className="dashboard-action-card"
            onClick={onViewBorrowedAssets}
          >

            <div className="dashboard-icon borrowed-icon">
              🎒
            </div>

            <h3>
              My Borrowed Assets
            </h3>

            <p>
              View equipment currently assigned
              to you.
            </p>

            <button className="cams-button secondary">

              View Borrowed Assets
              <span> →</span>

            </button>

          </div>


        </div>


        {/* ================================
            DEPARTMENT INFORMATION
        ================================= */}

        <div className="dashboard-info-card">

          <div>

            <span className="info-label">
              YOUR DEPARTMENT
            </span>

            <h3>
              {user.department || "Not specified"}
            </h3>

            <p>
              Your department determines which
              campus resources you can access.
            </p>

          </div>


          <div className="department-badge">
            {user.department || "Student"}
          </div>

        </div>


        {/* ================================
            LOGOUT
        ================================= */}

        <div className="dashboard-footer">

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </main>

    </div>

  );

}
// ==================================================
// MY REQUESTS
// ==================================================


// ==================================================
// MY REQUESTS
// ==================================================

function MyRequests({ user, onBack }) {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const fetchRequests = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/requests/user/${user.id}`
        );

        const data =
          await response.json();


        if (!response.ok) {

          setError(
            data.message ||
            "Failed to load requests"
          );

          return;

        }


        setRequests(
          data.requests
        );


      } catch (error) {

        console.error(error);

        setError(
          "Unable to connect to server"
        );


      } finally {

        setLoading(false);

      }

    };


    fetchRequests();

  }, [user.id]);


  return (

    <div className="cams-page">

      {/* ================================
          TOP NAVBAR
      ================================= */}

      <nav className="cams-navbar">

        <div className="cams-logo">
          CAMS
        </div>


        <div className="cams-user-area">

          <div style={{ textAlign: "right" }}>

            <div className="cams-user-name">
              {user.name}
            </div>

            <div className="cams-role">
              Student
            </div>

          </div>


          <div className="user-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "S"}
          </div>

        </div>

      </nav>


      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="cams-content">

        {/* PAGE HEADER */}

        <div className="cams-page-header">

          <p className="dashboard-greeting">
            REQUEST HISTORY
          </p>

          <h1>
            My Requests
          </h1>

          <p>
            Track the assets you have requested
            and check their current status.
          </p>

        </div>


        {/* BACK BUTTON */}

        <button
          className="cams-button secondary"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>


        <div style={{ marginTop: "28px" }}>


          {/* LOADING */}

          {loading && (

            <div className="cams-card">

              <p>
                Loading your requests...
              </p>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="cams-card">

              <p style={{ color: "#dc2626" }}>
                {error}
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            requests.length === 0 && (

              <div className="cams-card">

                <h3>
                  No requests yet
                </h3>

                <p>
                  You haven't requested any campus
                  assets yet. Browse available assets
                  from your dashboard to get started.
                </p>

              </div>

            )}


          {/* REQUEST LIST */}

          {!loading &&
            !error &&
            requests.length > 0 && (

              <div>

                {requests.map((request) => (

                  <div
                    key={request.id}
                    className="asset-card"
                  >

                    {/* IMAGE */}

                    <div className="asset-image">

                      {request.image_url ? (

                        <img
                          src={request.image_url}
                          alt={request.asset_name}
                        />

                      ) : (

                        <p>
                          No image
                        </p>

                      )}

                    </div>


                    {/* DETAILS */}

                    <div className="asset-details">

                      <h3>
                        {request.asset_name}
                      </h3>


                      <p>
                        <strong>
                          Asset Code:
                        </strong>{" "}
                        {request.asset_code}
                      </p>


                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {request.category}
                      </p>


                      <p>
                        <strong>
                          Department:
                        </strong>{" "}
                        {request.department}
                      </p>


                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {request.location ||
                          "Not specified"}
                      </p>


                      {/* STATUS */}

                      <p>
                        <strong>
                          Request Status:
                        </strong>{" "}

                        <span
                          className={
                            request.status === "Approved"
                              ? "status-badge status-approved"
                              : request.status === "Rejected"
                              ? "status-badge status-rejected"
                              : "status-badge status-pending"
                          }
                        >
                          {request.status}
                        </span>

                      </p>


                      {/* REQUESTED DATE */}

                      <p>
                        <strong>
                          Requested At:
                        </strong>{" "}

                        {new Date(
                          request.requested_at
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </div>

      </main>

    </div>

  );

}


// ==================================================
// ADMIN REQUESTS
// ==================================================


// ==================================================
// ADMIN REQUESTS
// ==================================================

function AdminRequests({ user, onBack }) {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingRequest, setProcessingRequest] =
    useState(null);


  // ==================================================
  // FETCH ALL REQUESTS
  // ==================================================

  const fetchRequests = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/requests"
      );

      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.message ||
          "Failed to load requests"
        );

        return;

      }


      setRequests(
        data.requests
      );


    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to server"
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchRequests();

  }, []);


  // ==================================================
  // APPROVE / REJECT
  // ==================================================

  const handleRequestAction =
    async (requestId, action) => {

      try {

        setProcessingRequest(
          requestId
        );


        const response = await fetch(
          `http://localhost:5000/api/requests/${requestId}/${action}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );


        const data =
          await response.json();


        if (!response.ok) {

          alert(
            data.message ||
            `Failed to ${action} request`
          );

          return;

        }


        alert(data.message);

        await fetchRequests();


      } catch (error) {

        console.error(error);

        alert(
          "Unable to connect to server"
        );


      } finally {

        setProcessingRequest(
          null
        );

      }

    };


  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div className="cams-page">

      {/* ================================
          TOP NAVBAR
      ================================= */}

      <nav className="cams-navbar">

        <div className="cams-logo">
          CAMS
        </div>


        <div className="cams-user-area">

          <div style={{ textAlign: "right" }}>

            <div className="cams-user-name">
              {user.name}
            </div>

            <div className="cams-role">
              Administrator
            </div>

          </div>


          <div className="user-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "A"}
          </div>

        </div>

      </nav>


      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="cams-content">

        {/* PAGE HEADER */}

        <div className="cams-page-header">

          <p className="dashboard-greeting">
            ADMINISTRATION
          </p>

          <h1>
            Request Management
          </h1>

          <p>
            Review student asset requests and
            approve or reject them.
          </p>

        </div>


        {/* BACK BUTTON */}

        <button
          className="cams-button secondary"
          onClick={onBack}
        >
          ← Back to Admin Dashboard
        </button>


        <div style={{ marginTop: "28px" }}>


          {/* LOADING */}

          {loading && (

            <div className="cams-card">

              <p>
                Loading requests...
              </p>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="cams-card">

              <p style={{ color: "#dc2626" }}>
                {error}
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            requests.length === 0 && (

              <div className="cams-card">

                <h3>
                  No asset requests
                </h3>

                <p>
                  There are currently no asset
                  requests to review.
                </p>

              </div>

            )}


          {/* REQUEST LIST */}

          {!loading &&
            !error &&
            requests.length > 0 && (

              <div>

                {requests.map((request) => (

                  <div
                    key={request.id}
                    className="asset-card"
                  >

                    {/* =========================
                        IMAGE
                    ========================== */}

                    <div className="asset-image">

                      {request.image_url ? (

                        <img
                          src={request.image_url}
                          alt={request.asset_name}
                        />

                      ) : (

                        <p>
                          No image
                        </p>

                      )}

                    </div>


                    {/* =========================
                        DETAILS
                    ========================== */}

                    <div className="asset-details">

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "15px",
                          flexWrap: "wrap"
                        }}
                      >

                        <h3>
                          {request.asset_name}
                        </h3>


                        <span
                          className={
                            request.status === "Approved"
                              ? "status-badge status-approved"
                              : request.status === "Rejected"
                              ? "status-badge status-rejected"
                              : "status-badge status-pending"
                          }
                        >
                          {request.status}
                        </span>

                      </div>


                      <p>
                        <strong>
                          Asset Code:
                        </strong>{" "}
                        {request.asset_code}
                      </p>


                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {request.category}
                      </p>


                      <hr
                        style={{
                          border: 0,
                          borderTop:
                            "1px solid #e7eaf0",
                          margin: "20px 0"
                        }}
                      />


                      {/* STUDENT INFORMATION */}

                      <p>
                        <strong>
                          Requested By:
                        </strong>{" "}
                        {request.user_name}
                      </p>


                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {request.user_email}
                      </p>


                      <p>
                        <strong>
                          Department:
                        </strong>{" "}
                        {request.user_department ||
                          "Not specified"}
                      </p>


                      {/* REQUEST DATE */}

                      <p>
                        <strong>
                          Requested At:
                        </strong>{" "}

                        {new Date(
                          request.requested_at
                        ).toLocaleString()}

                      </p>


                      {/* =========================
                          APPROVE / REJECT
                      ========================== */}

                      {request.status === "Pending" && (

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px"
                          }}
                        >

                          <button
                            className="cams-button"
                            onClick={() =>
                              handleRequestAction(
                                request.id,
                                "approve"
                              )
                            }
                            disabled={
                              processingRequest ===
                              request.id
                            }
                          >

                            {processingRequest ===
                            request.id
                              ? "Processing..."
                              : "✓ Approve"}

                          </button>


                          <button
                            className="cams-button danger"
                            onClick={() =>
                              handleRequestAction(
                                request.id,
                                "reject"
                              )
                            }
                            disabled={
                              processingRequest ===
                              request.id
                            }
                          >

                            {processingRequest ===
                            request.id
                              ? "Processing..."
                              : "✕ Reject"}

                          </button>

                        </div>

                      )}


                      {/* ALREADY PROCESSED */}

                      {request.status === "Approved" && (

                        <p
                          style={{
                            marginTop: "18px",
                            color: "#166534",
                            fontWeight: "600"
                          }}
                        >
                          ✓ This request has been approved.
                        </p>

                      )}


                      {request.status === "Rejected" && (

                        <p
                          style={{
                            marginTop: "18px",
                            color: "#991b1b",
                            fontWeight: "600"
                          }}
                        >
                          ✕ This request has been rejected.
                        </p>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

        </div>

      </main>

    </div>

  );

}



// ==================================================
// BORROWED ASSETS
// ==================================================

// ==================================================
// BORROWED ASSETS
// ==================================================

function BorrowedAssets({ user, onBack }) {

  const [assets, setAssets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==================================================
  // FETCH BORROWED ASSETS
  // ==================================================

  useEffect(() => {

    const fetchBorrowedAssets =
      async () => {

        try {

          const response = await fetch(
            "http://localhost:5000/api/requests"
          );


          const data =
            await response.json();


          if (!response.ok) {

            setError(
              data.message ||
              "Failed to load borrowed assets"
            );

            return;

          }


          let borrowed;


          if (user.role === "admin") {

            borrowed =
              (data.requests || [])
                .filter(
                  (request) =>
                    request.status ===
                    "Approved"
                );

          } else {

            borrowed =
              (data.requests || [])
                .filter(
                  (request) =>
                    request.status ===
                      "Approved" &&
                    Number(request.user_id) ===
                      Number(user.id)
                );

          }


          setAssets(borrowed);


        } catch (error) {

          console.error(error);

          setError(
            "Unable to connect to server"
          );


        } finally {

          setLoading(false);

        }

      };


    fetchBorrowedAssets();

  }, [user.id, user.role]);


  // ==================================================
  // RETURN ASSET
  // ==================================================

  const handleReturnAsset = async (requestId) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/requests/${requestId}/return`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          }
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Failed to return asset"
        );

        return;

      }


      alert(
        data.message ||
        "Asset returned successfully!"
      );


      window.location.reload();


    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to server"
      );

    }

  };


  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div className="cams-page">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="cams-navbar">

        <div className="cams-logo">
          CAMS
        </div>


        <div className="cams-user-area">

          <div style={{ textAlign: "right" }}>

            <div className="cams-user-name">
              {user.name}
            </div>

            <div className="cams-role">
              {user.role === "admin"
                ? "Administrator"
                : "Student"}
            </div>

          </div>


          <div className="user-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

        </div>

      </nav>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="cams-content">


        {/* PAGE HEADER */}

        <div className="cams-page-header">

          <p className="dashboard-greeting">
            {user.role === "admin"
              ? "Asset Overview"
              : "Your Equipment"}
          </p>

          <h1>
            {user.role === "admin"
              ? "All Borrowed Assets"
              : "My Borrowed Assets"}
          </h1>

          <p>
            {user.role === "admin"
              ? "View all assets currently borrowed by students."
              : "View the campus equipment currently assigned to you."}
          </p>

        </div>


        {/* BACK BUTTON */}

        <button
          className="cams-button secondary"
          onClick={onBack}
          style={{ marginBottom: "28px" }}
        >
          ← Back to Dashboard
        </button>


        {/* LOADING */}

        {loading && (

          <div className="cams-card">

            <p>
              Loading borrowed assets...
            </p>

          </div>

        )}


        {/* ERROR */}

        {error && (

          <div className="cams-card">

            <p style={{ color: "#dc2626" }}>
              {error}
            </p>

          </div>

        )}


        {/* EMPTY STATE */}

        {!loading &&
          !error &&
          assets.length === 0 && (

            <div className="cams-card">

              <div
                className="dashboard-icon borrowed-icon"
                style={{ marginBottom: "15px" }}
              >
                🎒
              </div>

              <h3>
                No borrowed assets
              </h3>

              <p>
                {user.role === "admin"
                  ? "There are currently no assets borrowed by students."
                  : "You currently do not have any borrowed assets."}
              </p>

            </div>

          )}


        {/* ASSET LIST */}

        {!loading &&
          !error &&
          assets.length > 0 && (

            <div>

              {assets.map((request) => (

                <div
                  key={request.id}
                  className="asset-card"
                >

                  {/* =================================
                      IMAGE
                  ================================= */}

                  <div className="asset-image">

                    {request.image_url ? (

                      <img
                        src={request.image_url}
                        alt={request.asset_name}
                      />

                    ) : (

                      <p>
                        No image
                      </p>

                    )}

                  </div>


                  {/* =================================
                      DETAILS
                  ================================= */}

                  <div className="asset-details">

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "15px",
                        flexWrap: "wrap"
                      }}
                    >

                      <h3>
                        {request.asset_name}
                      </h3>

                      <span className="status-badge status-borrowed">
                        Borrowed
                      </span>

                    </div>


                    <p>
                      <strong>
                        Asset Code:
                      </strong>{" "}
                      {request.asset_code}
                    </p>


                    <p>
                      <strong>
                        Category:
                      </strong>{" "}
                      {request.category}
                    </p>


                    <p>
                      <strong>
                        Department:
                      </strong>{" "}
                      {request.asset_department ||
                        "Not specified"}
                    </p>


                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {request.location ||
                        "Not specified"}
                    </p>


                    {/* ADMIN ONLY */}

                    {user.role === "admin" && (

                      <>

                        <p>
                          <strong>
                            Borrowed By:
                          </strong>{" "}
                          {request.user_name}
                        </p>


                        <p>
                          <strong>
                            Student Email:
                          </strong>{" "}
                          {request.user_email}
                        </p>

                      </>

                    )}


                    <p>
                      <strong>
                        Approved At:
                      </strong>{" "}

                      {request.approved_at
                        ? new Date(
                            request.approved_at
                          ).toLocaleString()
                        : "Not available"}

                    </p>


                    {/* RETURN */}

                    {user.role !== "admin" && (

                      <button
                        className="cams-button danger"
                        onClick={() =>
                          handleReturnAsset(
                            request.id
                          )
                        }
                        style={{
                          marginTop: "12px"
                        }}
                      >
                        Return Asset
                      </button>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>

  );

}


// ==================================================
// ASSET MANAGEMENT
// ==================================================

function AssetManagement({ user, onBack }) {

  const [assets, setAssets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");


  // ==================================================
  // QUEUE INFORMATION
  // ==================================================

  const [queueInfo, setQueueInfo] =
    useState({});


  // ==================================================
  // ADD ASSET FORM
  // ==================================================

  const [showAddForm, setShowAddForm] =
    useState(false);


  const [assetName, setAssetName] =
    useState("");

  const [assetCode, setAssetCode] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [purchaseDate, setPurchaseDate] =
    useState("");

  const [warranty, setWarranty] =
    useState("");

  const [condition, setCondition] =
    useState("Good");

  const [image, setImage] =
    useState(null);


  // ==================================================
  // FETCH ASSETS
  // ==================================================

  const fetchAssets = async () => {

    try {

      setLoading(true);


      const response = await fetch(
        "http://localhost:5000/api/assets"
      );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.message ||
          "Failed to load assets"
        );

        return;

      }


      setAssets(
        data.assets
      );

      setError("");


    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to server"
      );


    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // FETCH QUEUE INFORMATION
  // ==================================================

  const fetchQueueInfo = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/requests"
      );


      const data =
        await response.json();


      if (!response.ok) {

        return;

      }


      const allRequests =
        data.requests || [];


      const queueMap = {};


      assets.forEach((asset) => {

        const pendingRequests =
          allRequests
            .filter(
              (request) =>
                Number(request.asset_id) ===
                  Number(asset.id) &&
                request.status ===
                  "Pending"
            )
            .sort(
              (a, b) =>
                new Date(
                  a.requested_at
                ) -
                new Date(
                  b.requested_at
                )
            );


        if (
          pendingRequests.length === 0
        ) {

          return;

        }


        const myRequestIndex =
          pendingRequests.findIndex(
            (request) =>
              Number(request.user_id) ===
              Number(user.id)
          );


        if (myRequestIndex !== -1) {

          queueMap[asset.id] = {

            position:
              myRequestIndex + 1,

            ahead:
              myRequestIndex

          };

        }

      });


      setQueueInfo(
        queueMap
      );


    } catch (error) {

      console.error(
        "Queue information error:",
        error
      );

    }

  };


  // ==================================================
  // INITIAL FETCH
  // ==================================================

  useEffect(() => {

    fetchAssets();

  }, []);


  // ==================================================
  // FETCH QUEUE AFTER ASSETS LOAD
  // ==================================================

  useEffect(() => {

    if (
      assets.length === 0
    ) {

      return;

    }


    fetchQueueInfo();

  }, [assets]);


  // ==================================================
  // SEARCH + FILTER
  // ==================================================

  const filteredAssets =
    assets.filter(
      (asset) => {

        const searchText =
          search.toLowerCase();


        const matchesSearch =

          (asset.asset_name || "")
            .toLowerCase()
            .includes(searchText) ||

          (asset.asset_code || "")
            .toLowerCase()
            .includes(searchText) ||

          (asset.department || "")
            .toLowerCase()
            .includes(searchText);


        const matchesCategory =

          categoryFilter ===
            "All" ||

          asset.category ===
            categoryFilter;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );


  // ==================================================
  // ADD ASSET
  // ==================================================

  const handleAddAsset =
    async (e) => {

      e.preventDefault();


      try {

        const formData =
          new FormData();


        formData.append(
          "asset_name",
          assetName
        );

        formData.append(
          "asset_code",
          assetCode
        );

        formData.append(
          "category",
          category
        );

        formData.append(
          "department",
          department
        );

        formData.append(
          "location",
          location
        );

        formData.append(
          "purchase_date",
          purchaseDate
        );

        formData.append(
          "warranty",
          warranty
        );

        formData.append(
          "condition",
          condition
        );


        if (image) {

          formData.append(
            "image",
            image
          );

        }


        const response =
          await fetch(
            "http://localhost:5000/api/assets",
            {
              method: "POST",

              headers: {
                "Authorization":
                  `Bearer ${localStorage.getItem("token")}`
              },

              body: formData
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          alert(
            data.message ||
            "Failed to add asset"
          );

          return;

        }


        alert(
          "Asset added successfully!"
        );


        setAssetName("");

        setAssetCode("");

        setCategory("");

        setDepartment("");

        setLocation("");

        setPurchaseDate("");

        setWarranty("");

        setCondition("Good");

        setImage(null);


        setShowAddForm(false);


        fetchAssets();


      } catch (error) {

        console.error(error);

        alert(
          "Unable to connect to server"
        );

      }

    };


  // ==================================================
  // REQUEST / JOIN QUEUE
  // ==================================================

  const handleRequestAsset =
    async (assetId) => {

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/requests",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                user_id:
                  user.id,

                asset_id:
                  assetId

              })

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          alert(
            data.message ||
            "Failed to request asset"
          );

          return;

        }


        alert(
          "Asset request submitted successfully!"
        );


        await fetchAssets();


      } catch (error) {

        console.error(error);

        alert(
          "Unable to connect to server"
        );

      }

    };


  // ==================================================
  // PAGE
  // ==================================================

    return (

    <div className="cams-page">

      {/* =========================================
          TOP NAVBAR
      ========================================= */}

      <nav className="cams-navbar">

        <div className="cams-logo">
          CAMS
        </div>

        <div className="cams-user-area">

          <div style={{ textAlign: "right" }}>

            <div className="cams-user-name">
              {user.name}
            </div>

            <div className="cams-role">
              {user.role === "admin" ? "Administrator" : "Student"}
            </div>

          </div>

          <div className="user-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

        </div>

      </nav>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="cams-content">

        {/* PAGE HEADER */}

        <div className="cams-page-header">

          <p className="dashboard-greeting">
            {user.role === "admin"
              ? "Asset administration"
              : "Campus resources"}
          </p>

          <h1>
            Asset Management
          </h1>

          <p>
            {user.role === "admin"
              ? "Manage campus equipment and keep asset information up to date."
              : "Browse campus equipment and request the assets you need."}
          </p>

        </div>


        {/* =========================================
            BACK BUTTON
        ========================================= */}

        <button
          className="cams-button secondary"
          onClick={onBack}
          style={{ marginBottom: "25px" }}
        >
          ← Back to Dashboard
        </button>


        {/* =========================================
            SEARCH + FILTER
        ========================================= */}

        <div className="cams-search-area">

          <input
            type="text"
            placeholder="Search by asset name, code, or department..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >

            <option value="All">
              All Categories
            </option>

            <option value="Laboratory Equipment">
              Laboratory Equipment
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Computer Equipment">
              Computer Equipment
            </option>

            <option value="Embedded Systems">
              Embedded Systems
            </option>

          </select>

        </div>


        {/* =========================================
            ADMIN ADD ASSET
        ========================================= */}

        {user.role === "admin" && !showAddForm && (

          <div style={{ marginBottom: "28px" }}>

            <button
              className="cams-button"
              onClick={() =>
                setShowAddForm(true)
              }
            >
              + Add New Asset
            </button>

          </div>

        )}


        {/* =========================================
            ADD ASSET FORM
        ========================================= */}

        {user.role === "admin" && showAddForm && (

          <div
            className="cams-form"
            style={{
              maxWidth: "850px",
              marginBottom: "30px"
            }}
          >

            <h2 style={{ marginTop: 0 }}>
              Add New Asset
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "25px"
              }}
            >
              Enter the details of the new campus asset.
            </p>


            <form onSubmit={handleAddAsset}>

              {/* ASSET NAME */}

              <div className="cams-form-group">

                <label>
                  Asset Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Oscilloscope"
                  value={assetName}
                  onChange={(e) =>
                    setAssetName(e.target.value)
                  }
                  required
                />

              </div>


              {/* ASSET CODE */}

              <div className="cams-form-group">

                <label>
                  Asset Code
                </label>

                <input
                  type="text"
                  placeholder="Example: ECE-OSC-002"
                  value={assetCode}
                  onChange={(e) =>
                    setAssetCode(e.target.value)
                  }
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="cams-form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Example: Laboratory Equipment"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                />

              </div>


              {/* DEPARTMENT */}

              <div className="cams-form-group">

                <label>
                  Department
                </label>

                <input
                  type="text"
                  placeholder="Example: ECE"
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  required
                />

              </div>


              {/* LOCATION */}

              <div className="cams-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Example: ECE Lab 1"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />

              </div>


              {/* PURCHASE DATE */}

              <div className="cams-form-group">

                <label>
                  Purchase Date
                </label>

                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) =>
                    setPurchaseDate(e.target.value)
                  }
                />

              </div>


              {/* WARRANTY */}

              <div className="cams-form-group">

                <label>
                  Warranty
                </label>

                <input
                  type="text"
                  placeholder="Example: 3 years"
                  value={warranty}
                  onChange={(e) =>
                    setWarranty(e.target.value)
                  }
                />

              </div>


              {/* CONDITION */}

              <div className="cams-form-group">

                <label>
                  Condition
                </label>

                <select
                  value={condition}
                  onChange={(e) =>
                    setCondition(e.target.value)
                  }
                >

                  <option value="Good">
                    Good
                  </option>

                  <option value="Fair">
                    Fair
                  </option>

                  <option value="Poor">
                    Poor
                  </option>

                  <option value="Damaged">
                    Damaged
                  </option>

                  <option value="Under Maintenance">
                    Under Maintenance
                  </option>

                </select>

              </div>


              {/* IMAGE */}

              <div className="cams-form-group">

                <label>
                  Asset Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files[0])
                  }
                />

                {image && (
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#6b7280",
                      fontSize: "13px"
                    }}
                  >
                    Selected: {image.name}
                  </p>
                )}

              </div>


              {/* FORM BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "25px"
                }}
              >

                <button
                  type="submit"
                  className="cams-button"
                >
                  Add Asset
                </button>

                <button
                  type="button"
                  className="cams-button secondary"
                  onClick={() =>
                    setShowAddForm(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* =========================================
            ASSET LIST
        ========================================= */}

        {loading && (

          <div className="cams-card">

            <p style={{ margin: 0 }}>
              Loading assets...
            </p>

          </div>

        )}


        {error && (

          <div className="cams-card">

            <p
              style={{
                margin: 0,
                color: "#dc2626",
                fontWeight: "600"
              }}
            >
              {error}
            </p>

          </div>

        )}


        {!loading &&
          !error &&
          filteredAssets.length === 0 && (

            <div className="cams-card">

              <h3>
                No assets found
              </h3>

              <p>
                No assets match your current search or category filter.
              </p>

            </div>

          )}


        {!loading &&
          !error &&
          filteredAssets.length > 0 && (

            <div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px"
                }}
              >

                <h2 style={{ margin: 0 }}>
                  Available Assets
                </h2>

                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "14px"
                  }}
                >
                  {filteredAssets.length} asset
                  {filteredAssets.length !== 1 ? "s" : ""}
                </span>

              </div>


              {filteredAssets.map((asset) => (

                <div
                  key={asset.id}
                  className="asset-card"
                >

                  {/* IMAGE */}

                  <div className="asset-image">

                    {asset.image_url ? (

                      <img
                        src={asset.image_url}
                        alt={asset.asset_name}
                      />

                    ) : (

                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "14px"
                        }}
                      >
                        No image available
                      </span>

                    )}

                  </div>


                  {/* DETAILS */}

                  <div className="asset-details">

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "15px",
                        flexWrap: "wrap"
                      }}
                    >

                      <h3>
                        {asset.asset_name}
                      </h3>


                      <span
                        className={
                          asset.status === "Available"
                            ? "status-badge status-available"
                            : "status-badge status-borrowed"
                        }
                      >
                        {asset.status}
                      </span>

                    </div>


                    <p>
                      <strong>
                        Asset Code:
                      </strong>{" "}
                      {asset.asset_code}
                    </p>

                    <p>
                      <strong>
                        Category:
                      </strong>{" "}
                      {asset.category}
                    </p>

                    <p>
                      <strong>
                        Department:
                      </strong>{" "}
                      {asset.department}
                    </p>

                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {asset.location || "Not specified"}
                    </p>

                    <p>
                      <strong>
                        Condition:
                      </strong>{" "}
                      {asset.condition}
                    </p>


                    {/* =================================
                        REQUEST / QUEUE UI
                    ================================= */}

                    <div style={{ marginTop: "18px" }}>

                      {user.role === "admin" ? (

                        <p
                          style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "14px"
                          }}
                        >
                          Admin view — asset management only.
                        </p>

                      ) : asset.condition &&
                        asset.condition.toLowerCase() ===
                          "under maintenance" ? (

                        <p
                          style={{
                            margin: 0,
                            color: "#92400e",
                            fontWeight: "600"
                          }}
                        >
                          Asset is under maintenance.
                          Requests are not allowed.
                        </p>

                      ) : asset.status === "Available" ? (

                        <button
                          className="cams-button"
                          onClick={() =>
                            handleRequestAsset(asset.id)
                          }
                        >
                          Request Asset →
                        </button>

                      ) : (

                        <div>

                          <p
                            style={{
                              marginTop: 0,
                              color: "#6b7280",
                              fontSize: "14px"
                            }}
                          >
                            Asset is currently held by another student.
                          </p>


                          {queueInfo[asset.id] ? (

                            <div>

                              <p
                                style={{
                                  fontWeight: "700",
                                  marginBottom: "6px"
                                }}
                              >
                                You are #
                                {queueInfo[asset.id].position}
                                {" "}in the queue.
                              </p>

                              <p
                                style={{
                                  marginTop: 0,
                                  color: "#6b7280",
                                  fontSize: "14px"
                                }}
                              >
                                {queueInfo[asset.id].ahead}{" "}
                                {queueInfo[asset.id].ahead === 1
                                  ? "student is"
                                  : "students are"}{" "}
                                ahead of you.
                              </p>

                            </div>

                          ) : (

                            <button
                              className="cams-button secondary"
                              onClick={() =>
                                handleRequestAsset(asset.id)
                              }
                            >
                              Join Queue →
                            </button>

                          )}

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>

  );

}


// ==================================================
// EXPORT APP
// ==================================================

export default App;

