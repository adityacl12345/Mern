import React, { useEffect, useState } from "react";
import "./Input.css";

const validate = (value, validators = []) => {
  for (const validator of validators) {
    if (typeof validator !== 'function') continue;
    if (!validator(value)) return false;
  }
  return true;
};

const ControlledInput = (props) => {
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    const valid = validate(props.value, props.validators || []);
    setIsValid(valid);
  }, [props.value, props.validators]);

  const handleChange = (event) => {
    props.onChange(props.id, event.target.value);
    if (!isTouched) setIsTouched(true); // mark as touched on first change
  };

  const element =
    props.element === "textarea" ? (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        value={props.value}
        onChange={handleChange}
        onBlur={() => setIsTouched(true)} // also mark touched on blur
        placeholder={props.placeholder}
      />
    ) : (
      <input
        id={props.id}
        type={props.type}
        value={props.value}
        onChange={handleChange}
        onBlur={() => setIsTouched(true)}
        placeholder={props.placeholder}
      />
    );

  return (
    <div className={`form-control ${!isValid && isTouched && "form-control--invalid"}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!isValid && isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default ControlledInput;
