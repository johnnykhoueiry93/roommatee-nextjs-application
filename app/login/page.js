import SignIn from "../../components/login/SignIn";
import { getSession } from "../api/login/route";

async function fetchUserData(emailAddress, password) {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emailAddress, password }), // Send the parameters in the request body
    cache: 'no-store' // Ensures the data is fetched on every request
  });
  const data = await response.json();
  return data;
}

export default async function Login() {
  // Example email and password for demonstration
  const emailAddress = "johnny.kh@hotmail.com";
  const password = "password123";

  return (
    <div>
      <SignIn />
    </div>
  );
}



