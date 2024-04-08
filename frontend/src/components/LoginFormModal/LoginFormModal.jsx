import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
// import { demoUser } from '../../../../backend/db/seeders/20240210211714-demo-user';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  const isSubmitDisabled = credential.length < 4 || password.length < 6;
  const handleDemoUserLogin = () => {
    // setCredential(demoUser.email);
    // setPassword(demoUser.hashedPassword);
  };
  return (
    <><div className='modal-login'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username or Email'
            required
          />
        </label>
        <label>
         
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={isSubmitDisabled}>Log In</button>
      </form>
      <button onClick={handleDemoUserLogin} className="demo-user-button">Demo User</button>
      </div>
    </>
  );
}

export default LoginFormModal;
