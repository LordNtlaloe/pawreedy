
import Image from "next/image";
import Menu from "./Menu";
import logo from '/public/logo01.png'
import Link from "next/link";
import MobileMenu from "./MobileMenu";


const Navbar = () => {


  return (
    <main className="w-[100%] bg-white h-20 text-[#51358C] flex justify-between items-center px-4 sticky top-0 left-0 right-0 z-10">
      {/* Logo */}
      <Link href='/'>
        <Image src={logo} width={120} height={60} alt="Pawreedy Logo"/>
      </Link>

      <div>
        <div className="hidden md:flex justify-between">
          <Menu />
        </div>
        <MobileMenu />
      </div>
    </main>
  );
};

export default Navbar;