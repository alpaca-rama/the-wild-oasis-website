import SideNavigation from "@/app/_components/SideNavigation";
import SignOutButton from "@/app/_components/SignOutButton";


export default function Layout({ children }) {
    return (
        <div className={'grid grid-cols-[16rem_1fr] h-full'}>
            <SideNavigation />
            <div className={'py-2'}>{children}</div>
        </div>
    )
}