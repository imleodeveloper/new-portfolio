import { Type } from "lucide-react";
import Image from "next/image";

export function HomePage() {
  return (
    <article className="w-full flex justify-center items-center container">
      <section className="max-w-5xl w-full grid grid-cols-1 items-center">
        <div className="w-full h-56 relative justify-center items-center flex">
          <Image
            src="/codes-background-main.webp"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full relative grid grid-cols-[0.65fr_2fr] px-4 items-center gap-16">
          <div className="relative w-full">
            <div className="absolute -top-42 w-64 flex flex-col justify-start items-center bg-gray-900 gap-4 p-4">
              <div className="relative w-full min-h-26 flex justify-center items-center">
                <div className="w-full absolute -top-24 flex justify-center items-center">
                  <Image
                    src="/leo-foto.webp"
                    alt=""
                    width={180}
                    height={180}
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex justify-center items-center gap-2">
                <span className="bg-gray-700 rounded-full p-2 flex justify-center items-center">
                  <Type className="w-4 h-4"></Type>
                </span>
                <span className="bg-gray-700 mb-2 rounded-full p-2 flex justify-center items-center">
                  <Type className="w-4 h-4"></Type>
                </span>
                <span className="bg-gray-700 rounded-full p-2 flex justify-center items-center">
                  <Type className="w-4 h-4"></Type>
                </span>
              </div>
              <div className="flex justify-center items-center rounded-lg bg-gradient-to-r from-gray-500 to-transparent text-gray-900 py-1 px-2 font-bold">
                Leonardo
              </div>
              {/* NOME */}
              <div className="flex flex-col justify-center items-center gap-2">
                <span className="text-gray-400 text-sm">
                  imleodeveloper@gmail.com
                </span>
                <span className="text-gray-400 text-sm">(11) 96738-1402</span>
              </div>
              {/* CONTATO */}
            </div>
          </div>
          <div className="w-full relative grid grid-cols-1 gap-4 items-center mt-4">
            <div className="w-full grid grid-cols-2 items-center">
              <button className="text-center bg-blue-600 text-white rounded-l-xs font-semibold py-2 cursor-pointer hover:bg-blue-900">
                Sobre Mim
              </button>
              <button className="text-center bg-gray-600 text-white rounded-r-xs font-semibold py-2 cursor-pointer hover:bg-gray-900">
                Principais Projetos
              </button>
            </div>
            <div className="bg-gray-900 p-4 rounded-xs flex flex-col justify-start items-start gap-4">
              <h1 className="text-3xl font-bold">Sobre Mim</h1>
              <p>
                Atuo na área de T.I há 3 anos, sendo 2 deles dedicados ao
                suporte técnico. Desde junho de 2024, migrei para o
                desenvolvimento, onde participei de projetos como sites
                empresariais, jogos de memória e mais. Atualmente, estou no
                último semestre do bacharelado sistemas de informação e
                envolvido em diversos projetos de desenvolvimento web.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
