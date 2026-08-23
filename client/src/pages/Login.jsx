import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    // For now, just go to dashboard
    navigate("/dashboard");
  }

  return (
    <div>

      <h1>CAMS</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/signup">Sign up</Link>
      </p>

    </div>
  );
}

export default Login;