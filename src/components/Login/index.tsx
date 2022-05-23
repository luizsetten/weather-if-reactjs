import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import "./styles.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password)
      return toast.error("Digite e-mail e senha para continuar!");

    try {
      const {
        data: {
          token,
          user: { role },
        },
      } = await api.post<
        unknown,
        { data: { token: string; user: { role: string } } }
      >("/users/authenticate", {
        email,
        password,
      });

      sessionStorage.setItem("@weatherData/userToken", token);
      if (role === "admin") return navigate("/adminDashboard");
      return navigate("/userDashboard");
    } catch {
      return toast.error("Usuário e/ou senha inválido!");
    }
  }

  return (
    <div>
      <div className="container_login">
        <label htmlFor="email">
          Email
          <input
            className="input-login"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            className="input-login"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </label>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </div>
      <a href="./createUser">Cadastre-se aqui</a>
    </div>
  );
}
