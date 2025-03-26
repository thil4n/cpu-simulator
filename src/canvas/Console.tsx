const Console = ({ logs }: { logs: { type: string; message: string }[] }) => {
  return (
    <div className="w-full text-white bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4">
      {logs.map((log, index) => (
        <p
          key={index}
          className={log.type === "error" ? "text-red-500" : "text-green-400"}
        >
          [{log.type == "error" ? "ERROR" : "~"}] {log.message}
        </p>
      ))}
    </div>
  );
};

export default Console;
