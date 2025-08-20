"use client";
import { Type } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function HomePage() {
  const [isSection, setIsSection] = useState("Sobre");
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
        <div className="w-full relative grid grid-cols-1 lg:grid-cols-[0.65fr_2fr] px-4 items-center gap-16">
          <div className="relative w-full">
            <div className="w-full mt-36 lg:mt-0 lg:absolute lg:-top-42 lg:w-64 flex flex-col justify-start items-center bg-gray-900 gap-4 p-4 rounded-xs">
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
              <div className="flex flex-col justify-center items-center gap-2">
                <span className="text-gray-400 text-sm">
                  imleodeveloper@gmail.com
                </span>
                <span className="text-gray-400 text-sm">(11) 96738-1402</span>
              </div>
            </div>
          </div>
          <div className="w-full relative grid grid-cols-1 gap-4 items-center mt-4">
            <div className="w-full grid grid-cols-2 items-center">
              <button
                className={`text-center text-white rounded-l-xs font-semibold py-2 cursor-pointer ${
                  isSection === "Sobre"
                    ? "bg-blue-600 hover:bg-blue-900"
                    : "bg-gray-600 hover:bg-gray-900"
                }`}
                onClick={() => setIsSection("Sobre")}
              >
                Sobre Mim
              </button>
              <button
                className={`text-center text-white rounded-r-xs font-semibold py-2 cursor-pointer ${
                  isSection === "Projetos"
                    ? "bg-blue-600 hover:bg-blue-900"
                    : "bg-gray-600 hover:bg-gray-900"
                }`}
                onClick={() => setIsSection("Projetos")}
              >
                Principais Projetos
              </button>
            </div>
            <div className="w-full bg-gray-900 p-4 rounded-xs flex flex-col justify-start items-start gap-4">
              {isSection === "Sobre" && (
                <>
                  <h1 className="text-3xl font-bold">Sobre</h1>
                  <p>
                    Atuo na área de T.I há 3 anos, sendo 2 deles dedicados ao
                    suporte técnico. Desde junho de 2024, migrei para o
                    desenvolvimento, onde participei de projetos como sites
                    empresariais, jogos de memória e mais. Atualmente, estou no
                    último semestre do bacharelado sistemas de informação e
                    envolvido em diversos projetos de desenvolvimento web.
                  </p>
                  <div className="w-full"></div>
                </>
              )}
              {isSection === "Projetos" && (
                <>
                  <div className="w-full grid grid-cols-1 items-center gap-2">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
                      <div className="flex flex-col justify-center items-center gap-2 border border-gray-800 pb-1 rounded-xs">
                        <div className="bg-gray-600 rounded-xs w-full h-36"></div>
                        <div className="w-full flex justify-between items-center px-1">
                          <span>Project Name</span>
                          <Link
                            className="rounded-xs text-sm text-center py-1 px-2 border border-[#1e90ff] font-semibold hover:bg-[#1e90ff] hover:text-black transition-all duration-300"
                            href=""
                          >
                            Ver Mais
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center gap-2 border border-gray-800 pb-1 rounded-xs">
                        <div className="bg-gray-600 rounded-xs w-full h-36"></div>
                        <div className="w-full flex justify-between items-center px-1">
                          <span>Project Name</span>
                          <Link
                            className="rounded-xs text-sm text-center py-1 px-2 border border-[#1e90ff] font-semibold hover:bg-[#1e90ff] hover:text-black transition-all duration-300"
                            href=""
                          >
                            Ver Mais
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center gap-2 border border-gray-800 pb-1 rounded-xs">
                        <div className="bg-gray-600 rounded-xs w-full h-36"></div>
                        <div className="w-full flex justify-between items-center px-1">
                          <span>Project Name</span>
                          <Link
                            className="rounded-xs text-sm text-center py-1 px-2 border border-[#1e90ff] font-semibold hover:bg-[#1e90ff] hover:text-black transition-all duration-300"
                            href=""
                          >
                            Ver Mais
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                      <button className="w-full bg-blue-600 font-semibold p-2 text-center rounded-xs cursor-pointer hover:bg-blue-900">
                        Mais Projetos
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
