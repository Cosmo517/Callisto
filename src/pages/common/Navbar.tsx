function Navbar() {
    return (
        <div className="w-full h-18 bg-navbar-color border border-b-accent-2 flex flex-row items-center text-xl gap-6">
            <button className="text-off-white cursor-pointer ml-4 hover:underline underline-offset-8">
                Library
            </button>
            <button className="text-off-white cursor-pointer">
                Screenshots
            </button>
            <button className="text-off-white cursor-pointer">
                Statistics
            </button>
        </div>
    );
}

export default Navbar;
