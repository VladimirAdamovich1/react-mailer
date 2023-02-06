import React from "react";
import "./Dashboard.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    }
  });
  const nameRef = React.createRef();
  const surnameRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const [users, setUsers] = useState([]);
  const _isIncorrectEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
      return false;

    return true;
  };
  const ifEmpty = (e) => {
    if (e.target.value !== "") {
      e.target.classList.remove("error");
    }
  };
  const validate = async (e) => {
    e.preventDefault();
    const inputs = [nameRef, surnameRef, emailRef, passwordRef];
    const toEnterInps = inputs.filter((input) => input.current.value === "");
    if (toEnterInps.length > 0) {
      toEnterInps[0].current.focus();
      toEnterInps[0].current.classList.add("error");
      return;
    }
    addEmailHandler();
  };

  const comunicatorHandler = (typeComunicator) => {
    const comunicator = document.querySelector(".comunicator");
    if (typeComunicator) {
      comunicator.classList.add("comunicator-true");
      comunicator.innerHTML = " <img src='Check.svg'/> user was added";
      setTimeout(() => {
        comunicator.classList.remove("comunicator-true");
        comunicator.innerHTML = "";
      }, 3000);
    } else {
      comunicator.innerHTML = " <img src='error.png'/> user was not added";
      comunicator.classList.add("comunicator-false");
      setTimeout(() => {
        comunicator.classList.remove("comunicator-false");
        comunicator.innerHTML = "";
      }, 3000);
    }
  };

  const addEmailHandler = async (e) => {
    const name = nameRef.current.value,
      surname = surnameRef.current.value,
      email = emailRef.current.value,
      password = passwordRef.current.value;

    if (
      name.length < 5 ||
      surname.length < 5 ||
      password.length < 5 ||
      _isIncorrectEmail(email)
    ) {
      return;
    }

    const data = { name, surname, email, password };

    const response = await axios.post("/api/users", { data, token });

    if (response.data.success) {
      const inputs = [nameRef, surnameRef, emailRef, passwordRef];
      inputs.forEach((input) => (input.current.value = ""));
      comunicatorHandler(true);
      getUsersHandler();
    } else {
      comunicatorHandler(false);
    }
  };

  const getUsersHandler = async () => {
    const response = await axios.get("/api/users", {
      headers: {
        token: token,
      },
    });

    if (response.data.success) {
      const users = response.data.users;
      setUsers(users);
    }
  };
  const deleteUser = async (id) => {
    const response = await axios.delete("/api/users", {
      headers: {
        id: id,
        token: token,
      },
    });
    if (response.data.success) {
      getUsersHandler();
    }
  };
  useEffect(() => {
    getUsersHandler();
  }, []);
  return (
    <div className="Dashboard-container">
      <h1>Welcome in mailer Dashboard</h1>
      <form>
        <input
          onChange={(e) => ifEmpty(e)}
          defaultValue="adminv"
          ref={nameRef}
          type="text"
          placeholder="Name"
        />
        <input
          onChange={(e) => ifEmpty(e)}
          defaultValue="adminv"
          ref={surnameRef}
          type="text"
          placeholder="Surname"
        />
        <input
          onChange={(e) => ifEmpty(e)}
          maxLength="26"
          defaultValue="admin@technischools.com"
          ref={emailRef}
          type="text"
          placeholder="Email"
        />
        <input
          onChange={(e) => ifEmpty(e)}
          defaultValue={1234433321}
          ref={passwordRef}
          type="text"
          placeholder="Password"
        />
        <button onClick={validate}>Dodaj</button>
      </form>
      <p className="comunicator"></p>
      <div className="users">
        {users.map((user) => {
          return (
            <div className="user" key={user._id}>
              <p>
                <span>Name: </span>
                <textarea readOnly>{user.name}</textarea>
              </p>
              <p>
                <span>Surname: </span>
                <textarea readOnly>{user.surname}</textarea>
              </p>
              <p>
                <span>Email: </span>
                <textarea readOnly>{user.email}</textarea>
              </p>
              <p>
                <span>Password: </span>
                <textarea readOnly>{user.password}</textarea>
              </p>
              <button onClick={(_id) => deleteUser(user._id)}>delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
