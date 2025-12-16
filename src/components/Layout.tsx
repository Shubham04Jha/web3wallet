import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = ({children}:{children?: React.ReactNode})=>{
    return (
        <div className='bg-navy-900 min-h-screen h-full px-4 pt-4 pb-2 flex flex-col'>
            <Header/>
            <div className="grow ">
                {children}
            </div>
            <Footer/>
        </div>
    )
}


