import { Cpu } from "lucide-react";

const About = () => {
    return (
        <div className="w-full px-4 mx-auto flex flex-col justify-center items-center">
            <Cpu size={48} className="text-secondary animate-cpu-spin mb-6" />

            <p className="text-gray-300 text-md text-center leading-relaxed py-2">
                CPU Simulator is a web-based tool that lets you visualize how a
                CPU executes assembly instructions. You can load instructions,
                monitor registers, and examine memory in real-time — all from
                your browser. Built with React and Vite, it’s designed to help
                learners and enthusiasts explore computer architecture,
                debugging, and reverse engineering with an interactive
                interface.
            </p>

            <ul className="my-4">
                <li>
                    Intro video :{" "}
                    <a
                        className="underline hover:text-white"
                        href="youtube.com"
                    >
                        Watch here
                    </a>
                </li>
                <li>
                    Research paper :{" "}
                    <a
                        className="underline hover:text-white"
                        href="youtube.com"
                    >
                        Read here
                    </a>
                </li>
                <li>
                    Contact :{" "}
                    <a
                        className="underline hover:text-white"
                        href="mailto:thilan@wso2.com"
                    >
                        thilan@wso2.com
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default About;
