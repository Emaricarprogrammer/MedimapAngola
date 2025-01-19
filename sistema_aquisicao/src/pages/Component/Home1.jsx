import React from "react";

function Home1() {
  return (
    <div><div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    {/* Logo */}
    <div className="mb-8">
        <div className="flex justify-center items-center min-h-screen">
        <img src="/MedMap.png" alt="resposiva"
        className="max-w-full  w-48 h-48 rounded-full shadow-lg"
        />
        </div>
      <h1 className="flex justify-center items-center max-h-px text-3xl font-bold">
        <span className="text-green-600">M</span>
        <span>edmap</span>
      </h1>
    </div>

    {/* Main Content */}
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Medicamentos ao seu alcance: <br /> Encontre os Depósitos Mais Próximos
      </h2>
      <p className="text-gray-600 mb-6">
        Nosso sistema conecta você aos depósitos mais próximos em poucos cliques. Pesquise pelo medicamento necessário e encontre rapidamente onde comprar.
      </p>

      {/* Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center font-medium hover:bg-green-700">
          <span className="mr-2">Entrar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 12.121A3 3 0 118.464 8.46M17 16v5m0 0h5m-5 0l-5-5m10-7H9"
            />
          </svg>
        </button>
        <button className="px-6 py-2 bg-black text-white rounded-lg flex items-center font-medium hover:bg-gray-800">
          <span className="mr-2">Criar conta</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>

    {/* Footer */}
    <footer className="relative w-full mt-10 text-sm text-gray-500">
      <div className="absolute left-4 font-bold flex justify-w-full max-w-3xl">
        <a href="#" className="hover:underline">
          Contacto
        </a>
        <div className=" flex space-x-4">
          <a href="#" className=" hover:underline">
            Termos & Condições
          </a>
          <a href="#" className="hover:underline">
            Guia
          </a>
          <a href="#" className="hover:underline">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  </div>
</div>
  )
}

export default Home1