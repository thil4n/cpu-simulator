import { GitFork, Info, Heart, Cpu } from "lucide-react";

const NavBar = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  return (
    <nav className="z-30 fixed top-0 left-0 w-full h-8 bg-primary border-b-2 border-slate-500 shadow-md">
      <div className="px-4 mx-auto flex justify-between items-center h-full text-white">
        <a
          href={baseUrl}
          className="flex items-center gap-1 hover:text-gray-300 font-medium"
        >
          <Cpu size={20} /> CPU Simulator
        </a>
        <div className="flex gap-6 text-sm hover:text-gray-300">
          <a
            href="https://github.com/thil4n/cpu-simulator"
            className="flex items-center gap-1"
          >
            <GitFork size={16} /> Contribute
          </a>
          <a
            href="https://github.com/sponsors/thil4n"
            className="flex items-center gap-1"
          >
            <Heart size={16} /> Sponsor
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
