function Signup() {
  return (
    <div>
      <h1>CAMS</h1>

      <h2>Create Account</h2>

      <form>
        <input
          type="text"
          placeholder="Name"
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
        />

        <br /><br />

        <button type="submit">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;