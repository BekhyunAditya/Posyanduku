import Navbar from '@/Components/layout/Navbar';
export default function PublicLayout({ children }) {
    return (<div className="flex min-h-screen flex-col bg-[#F7F5F0] pb-12">
            <Navbar />
            {children}
        </div>);
}
