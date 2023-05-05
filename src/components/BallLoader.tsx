const BallLoader = () => {
  return (
    <div className="relative">
      <div className="absolute z-10 h-14 w-14 animate-ball-bounce overflow-hidden rounded-[50%] border-2 border-black bg-orange-500"></div>
      <div className="absolute top-12 h-2 w-14 animate-shadow-scale rounded-[50%] bg-black/20"></div>
    </div>
  );
};

export default BallLoader;
