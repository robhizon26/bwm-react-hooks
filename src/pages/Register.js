import React, { useState } from 'react';
import RegisterForm from 'components/forms/RegisterForm';
import { registerUser } from 'actions';
import { Redirect } from 'react-router-dom';
import ApiErrors from 'components/forms/ApiErrors';

const Register = props => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errors, setErrors] = useState([]);

  const signUp = (registerData) => {
    registerUser(registerData)
      .then(_ => setShouldRedirect(true))
      .catch(errors => setErrors(errors))
  }

  if (shouldRedirect) {
    return <Redirect to={{ pathname: '/login', state: { message: 'You have been succesfuly registered!' } }} />
  }

  return (
    <div className="bwm-form">
      <div className="row">
        <div className="col-md-5">
          <h1 className="page-title">Register</h1>
          <RegisterForm onSubmit={signUp} />
          <ApiErrors errors={errors} />
        </div>
        <div className="col-md-6 ml-auto">
          <div className="image-container">
            <h2 className="catchphrase">As our member you have access to most awesome places in the world.</h2>
            <img src="/images/register-image.jpg" alt="Register an user" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;
 