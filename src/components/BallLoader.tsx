import Rive from "@rive-app/react-canvas"

export default function BallLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Rive src="basketball-bounce.riv" className="w-48 h-48" />
    </div>
  )
}
