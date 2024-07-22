import Joi from "joi-browser";

const InstructionSchema = {
    instruction: Joi.string().required().label("Instruction"),
};

export default InstructionSchema;
