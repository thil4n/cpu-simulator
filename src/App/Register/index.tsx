const Register = ({ register, handleClick }) => {
  return (
    <div
      onClick={() => handleClick(register)}
      className="w-full border-2 bg-primary px-3 py-2 font-semibold  text-secondary hover:text-white hover:bg-secondary border-slate-500 cursor-pointer rounded-sm mb-2 text-center uppercase"
    >
      {register.key}
    </div>
  );
};

export default Register;
