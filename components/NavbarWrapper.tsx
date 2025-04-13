import dynamic from "next/dynamic";

// Dynamically import the client-side Navbar component
const Navbar = dynamic(() => import("./Navbar"), { ssr: true });

export default function NavbarWrapper() {
  return <Navbar />;
}
