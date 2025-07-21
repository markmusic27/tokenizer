import { Gradient } from "./components/Gradient";
import { NavBar } from "./components/NavBar";

export default function HomePage() {
  return (
    <div className="relative h-screen min-h-[800px] w-full">
      <NavBar />
      <Gradient />
    </div>
  );
}
