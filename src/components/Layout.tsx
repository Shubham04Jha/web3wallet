import { Header } from "./Header";
import { Footer } from "./Footer";
export const Layout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='bg-bg-primary min-h-screen text-text-primary font-sans selection:bg-text-accent selection:text-bg-primary '>
            <div className="flex flex-col px-4 py-8 max-w-5xl min-h-screen mx-auto h-full relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-text-accent/5 blur-[120px] rounded-full pointer-events-none -z-0" />
                <Header />
                <div className="grow z-10 animate-[fade-in_0.5s_ease-out]">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    )
}




