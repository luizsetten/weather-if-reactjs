import React, { FormEvent, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser } from "../../services/api";
import "./styles.css";

export function CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function cleanFields() {
    setEmail("");
    setPassword("");
    setRepeatPassword("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password || !email || !repeatPassword) {
      toast.error("Verifique os campos!");
      return;
    }

    if (password !== repeatPassword) {
      toast.error("As senhas devem ser iguais!");
      return;
    }

    try {
      await createUser({ email, password });
      toast.success("Usuário criado com sucesso!");
      cleanFields();
      setTimeout(() => {
        handleBack();
      }, 5000);
    } catch (erro: any) {
      if (erro.response.data.message) {
        toast.error(erro.response.data.message);
      } else {
        toast.error("Erro na requisição");
      }
    }
  }

  return (
    <>
      <header className="create-user-header ">
        <FaArrowLeft size={32} className="arrow" onClick={handleBack} />
        <h2>Registro</h2>
        <div />
      </header>
      <form onSubmit={handleSubmit} className="create-user-container">
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
          Senha
          <input
            className="input-login"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </label>
        <label htmlFor="repeatPassword">
          Repita a senha
          <input
            className="input-login"
            type="password"
            name="repeatPassword"
            id="repeatPassword"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.currentTarget.value)}
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}
