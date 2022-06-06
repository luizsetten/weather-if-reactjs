import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser } from "../../services/api";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <header className="p-fluid p-d-flex p-jc-between p-mb-6">
        <Button
          icon="pi pi-arrow-left"
          iconPos="right"
          className="p-button-raised p-button-rounded p-as-start"
          onClick={handleBack}
        />
        <h2>Registro</h2>
        <div />
      </header>
      <form onSubmit={handleSubmit} className="create-user-container">
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
              type="password"
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <label htmlFor="password">Senha</label>
          </span>

          <span className="p-float-label p-d-flex p-mb-5">
            <InputText
              id="repeatPassword"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.currentTarget.value)}
            />
            <label htmlFor="repeatPassword">Repita a senha</label>
          </span>
        </div>
        <Button label="Enviar" type="submit" />
      </form>
    </>
  );
}
