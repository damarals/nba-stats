import Rive from "@rive-app/react-canvas"

export default function BallLoader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50">
      <Rive src="basketball-bounce.riv" className="w-48 h-48" />
    </div>
  )
}
