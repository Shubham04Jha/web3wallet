import { Header } from "./Header";
import { Footer } from "./Footer";
export const Layout = ({children}:{children?: React.ReactNode})=>{
    return (
        <div className='bg-navy-900  px-4 pt-4 min-h-screen '>
            <div className="flex flex-col max-w-240 min-h-screen mx-auto h-full">
                <Header/>
                <div className="grow ">
                    {children}
                </div>
                <Footer/>
            </div>
        </div>
    )
}




