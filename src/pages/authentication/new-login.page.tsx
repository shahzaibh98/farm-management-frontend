import React from 'react';

function LoginPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50"
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'fit',
        backgroundPosition: 'center',
        backgroundImage:
          'url(https://images.unsplash.com/photo-1486754735734-325b5831c3ad?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
      }}
    >
      <div className="relative">
        <div className="flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white bg-opacity-20 shadow-lg px-4 backdrop-filter backdrop-blur-xl">
          <div className="flex-auto p-6">
            <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
              <a
                href="https://concaveagri.com"
                target="_blank"
                rel="noreferrer"
                className="flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500"
              >
                <span className="flex-shrink-0 text-3xl font-black text-secondaryColors-40 tracking-tight opacity-100">
                  Concave Agri
                </span>
              </a>
            </div>

            <h4 className="mb-2 font-bold text-2xl xl:text-xl">
              Welcome to Concave Farm!
            </h4>
            <p className="mb-6">Please sign-in to access your account</p>

            <form className="mb-4">
              <div className="mb-4">
                <label className="mb-2 inline-block text-xs font-medium uppercase">
                  Email
                </label>
                <input
                  type="text"
                  className="block w-full cursor-text appearance-none rounded-md bg-transparent  border border-secondaryColors-40 bg-opacity-20 py-2 px-3 text-sm outline-none focus:shadow"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <div className="flex justify-between">
                  <label className="mb-2 inline-block text-xs font-medium uppercase">
                    Password
                  </label>
                  <a
                    href=""
                    className="cursor-pointer text-indigo-500 no-underline hover:text-indigo-500"
                  >
                    <small className=" ">Forgot Password?</small>
                  </a>
                </div>
                <div className="relative flex w-full flex-wrap items-stretch">
                  <input
                    type="password"
                    className="relative block flex-auto cursor-text appearance-none bg-transparent rounded-md border border-secondaryColors-40 bg-transparent bg-opacity-20 py-2 px-3 text-sm outline-none focus:shadow placeholder-black"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="block">
                  <input
                    className="mt-1 mr-2 h-5 w-5 appearance-none rounded border border-gray-300 bg-contain bg-no-repeat align-top text-black shadow checked:bg-indigo-500 focus:border-indigo-500 focus:shadow"
                    type="checkbox"
                    id="remember-me"
                    checked
                  />
                  <label className="inline-block mt-1"> Remember Me </label>
                </div>
              </div>
              <div className="mb-4">
                <button
                  className="w-full cursor-pointer select-none rounded-md border border-indigo-500 bg-indigo-500 bg-opacity-50 py-2 px-5 text-center align-middle text-sm text-white shadow hover:border-indigo-600 hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:bg-indigo-600 focus:text-white focus:shadow-none"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
