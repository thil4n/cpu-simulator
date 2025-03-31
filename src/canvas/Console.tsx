const Console = ({ logs }: { logs: { type: string; message: string }[] }) => {
  return (
    <div className="w-full text-white bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4 max-h-[100px] overflow-y-auto">
      {logs.map((log, index) => (
        <p key={index} className="text-sm mb-2">
          [{log.type == "error" ? "ERROR" : "~"}] {log.message}
        </p>
      ))}
    </div>
  );
};

export default Console;
