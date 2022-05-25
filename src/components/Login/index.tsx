/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../config/axios";

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
      <div className="p-d-flex p-flex-column p-ai-center">
        <span className="p-float-label p-d-flex p-mb-5">
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <label htmlFor="email">E-mail</label>
        </span>

        <span className="p-float-label p-d-flex p-mb-5">
          <InputText
            id="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <label htmlFor="password">Senha</label>
        </span>
        <Button label="Login" onClick={handleLogin} className="p-mb-5" />
      </div>
      <a href="./createUser">Cadastre-se aqui</a>
    </div>
  );
}
