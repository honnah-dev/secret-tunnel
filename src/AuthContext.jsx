import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

async function signup(username) {
  try {
    const response = await fetch(API + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({username}),
    });
  const result = await response.json();
  console.log(result, "\n");

  setToken(result.token);
  setLocation("TABLET");

  } catch (e) {
    console.error("oh no :(");
  }
  
}
async function authenticate() {
  if (!token) {
    throw Error("No token found")
  }
  try {
    const response = await fetch(API + "/authenticate", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  const result = await response.json();
  console.log(result);

  setToken(result.token);
  setLocation("TUNNEL");

  } catch (e) {
    console.error("authentication failed", e);
    throw e;
  }
}


  // TODO: signup

  // TODO: authenticate

  const value = { token, location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}