
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        // <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        //     {children}
        // </div>

        <div className="flex flex-col min-h-screen py-4 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            {children}
        </div>
    )
}

export default AuthLayout
