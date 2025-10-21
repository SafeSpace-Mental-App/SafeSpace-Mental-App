const TailwindPratice = () => {
  return (
    <>
      <div className="bg-violet-200 h-10 w-full border-2 border-violet-600 rounded-md my-4 p-2 ">
        <p className="text-center text-red-500 font-mono font-extrabold">
          Hello world
        </p>
      </div>
      <div
        className="grid grid-cols-3 gap-2 mt-2 mx-2"
      >
        <div className="h-16 w-16 rounded-full bg-blue-500"></div>
        <div className="h-16 w-16 rounded-full bg-orange-500"></div>
        <div className="h-16 w-16 rounded-full bg-pink-500"></div>
      </div>
    </>
  );
};
export default TailwindPratice;
