import Link from "next/link";
import { FacebookIcon, InstagramIcon, Twitter, YoutubeIcon } from "lucide-react";
import { menuItems } from "@/lib/constants";
import { SignedIn } from "@clerk/nextjs";

const SecondaryNav = () => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }
  
  return (
    <main className="h-12 bg-[#51358C] flex items-center justify-between py-2 px-4">
      <div className="flex items-center gap-4">
      <ul className="flex md:flex-row flex-col gap-1 md:gap-6 items-center text-white" >
          <SignedIn>
            <Link href={'/dashboard'}>
              <button className="border  px-3 rounded my-1 bg-primary text-black transition-all hover:bg-primary/70" >Dashboard</button>
            </Link>
          </SignedIn>
  
          <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-[#F2DF7E] text-[#51358C]' : 'hover:bg-[#F2D888] hover:text-[#6C548C]',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <FacebookIcon className="text-blue-600" />
        <Twitter className="text-sky-700" />
        <YoutubeIcon className="text-red-500" />
        <InstagramIcon className="text-orange-700" />
      </div>
    </main>
  );
};

export default SecondaryNav;
