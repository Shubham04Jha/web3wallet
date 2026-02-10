import { Header } from "./Header";
import { Footer } from "./Footer";
export const Layout = ({children}:{children?: React.ReactNode})=>{
    return (
        <div className='bg-navy-900 min-h-screen '>
            <div className="flex flex-col px-4 py-4 max-w-4xl min-h-screen mx-auto h-full">
                <Header/>
                <div className="grow ">
                    {children}
                </div>
                <Footer/>
            </div>
        </div>
    )
}




