import { Button } from "@components";
import { gp_registers, adgp_registers } from "@lib";

const RegisterPanel = ({ handleClickRegister }) => {
    return (
        <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg mb-2 mt-2">
            <h1 className="bg-primary  text-secondary w-full py-1 text-sm text-center uppercase">
                CPU Registers
            </h1>
            <div className="grid grid-cols-3 gap-1 mt-3 px-2">
                <div>
                    {gp_registers.map((register) => {
                        return (
                            <Button
                                key={register}
                                text={register}
                                handleClick={() => {
                                    handleClickRegister(register);
                                }}
                            />
                        );
                    })}
                </div>
                <div>
                    {adgp_registers.map((register) => {
                        return (
                            <Button
                                key={register}
                                text={register}
                                handleClick={() => {
                                    handleClickRegister(register);
                                }}
                            />
                        );
                    })}
                </div>
                <div>
                    <Button
                        text={"RIP"}
                        handleClick={() => {
                            handleClickRegister("rip");
                        }}
                    />
                    <Button
                        text={"RFLAGS"}
                        handleClick={() => {
                            handleClickRegister("rflags");
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPanel;
