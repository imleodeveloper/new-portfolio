"use client";
import {
  Brain,
  Briefcase,
  CircleUserRound,
  Code,
  Crown,
  MessageCirclePlus,
  PhoneCall,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  return (
    <header className="w-full px-2 grid grid-cols-1 justify-between items-center fixed z-10 bg-black">
      {/*
			 <div className="flex justify-center items-center py-2 border-b-[0.5px] border-gray-600">
        <div className="text-sm text-center">
          <span className="uppercase font-bold">
            Você está precisando de um site ou sistema?
          </span>{" "}
          Descubra como posso transformar sua ideia.{" "}
          <a
            href="https://wa.me/5511967381402"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase ml-2 py-1 px-2 bg-white rounded-xl font-extrabold cursor-pointer text-[#1e90ff] hover:bg-gray-400 hover:text-blue-800"
          >
            Entrar em contato agora
          </a>
        </div>
      </div>
						*/}
      <nav className="flex justify-between items-center border-b border-gray-900">
        <div className="grid grid-cols-[1fr_1fr_2fr] items-center">
          <div className="flex justify-center items-center p-4">
            <span className="text-center italic uppercase font-extrabold text-lg/4">
              Leonardo <br />
              Vieira
            </span>
          </div>
          <a
            href="https://wa.me/5511967381402"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center p-4 text-base/4 bg-green-600 cursor-pointer hover:bg-green-300 "
          >
            <span className="text-center font-bold uppercase text-black">
              Contatar <br />
              Agora
            </span>
          </a>
          <div className="shadow-[inset_0_-3px_10px_rgba(212,175,55,0.4)] gap-2 flex justify-center px-6 items-center h-full">
            <div className="w-full flex flex-col justify-center items-center gap-1 border-r border-[rgb(212,175,55)]">
              <Crown className="text-[rgb(212,175,55)]"></Crown>
              <span className="text-xs font-extrabold uppercase text-center">
                3 Years EXP
              </span>
            </div>
            <div className="flex justify-center items-center w-full">
              <span className="text-center text-sm italic font-bold uppercase">
                Front-End <br />
                Developer
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_2fr_1fr] items-center relative">
          <a
            href="https://www.viercatech.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col relative justify-center items-center overflow-hidden border-x border-gray-700 hover:bg-gray-900"
          >
            <div className="h-16 w-16 relative">
              <Image src="/vierca-tech-namewhite.webp" alt="" fill />
            </div>
          </a>
          <a
            href="https://wa.me/5511967381402"
            target="_blank"
            rel="noopener noreferrer"
            className="h-full flex flex-col relative justify-center items-center gap-1 text-black bg-green-600 hover:bg-green-300 cursor-pointer overflow-hidden border-r border-gray-700"
          >
            <MessageCirclePlus className="h-8 w-8"></MessageCirclePlus>
            <span className="text-xs italic font-semibold">WhatsApp</span>
          </a>
          <div className="h-full flex flex-col flex justify-center items-center gap-1 overflow-hidden border-r border-gray-700">
            <input type="checkbox" />
            <span className="text-xs italic font-semibold">Light</span>
          </div>
          <div className="h-full bg-gradient-to-r from-[#1e90ff] to-blue-800 cursor-pointer hover:brightness-[40%] flex justify-center items-center flex-col gap-1 overflow-hidden border-r border-gray-700">
            <div className="relative h-8 w-8 flex justify-center items-center rounded-full overflow-hidden">
              <Image src="/leo-foto.webp" alt="" fill />
            </div>
            <span className="text-xs font-bold text-black uppercase">
              Developer
            </span>
          </div>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-full w-full flex justify-center items-center gap-1.5 flex-col cursor-pointer hover:bg-[#353535]"
          >
            <div className="w-6 h-[2px] bg-white"></div>
            <div className="w-6 h-[2px] bg-white"></div>
            <div className="w-6 h-[2px] bg-white"></div>
          </div>
          <div
            className={`absolute pt-6 overflow-y-auto top-full right-0 ${
              menuOpen ? "w-49.5" : "w-16.5"
            } h-screen bg-gray-900 flex flex-col justify-start items-center transition-all duration-300`}
          >
            <ul className="flex flex-col justify-start items-center gap-8">
              <li className="flex flex-col justify-center items-center gap-1">
                <Link
                  href=""
                  className="rounded-full overflow-hidden bg-gray-800 p-2 hover:bg-gray-500 text-white hover:text-[#1e90ff] transition-all duration-300"
                >
                  <CircleUserRound className="w-6 h-6"></CircleUserRound>
                </Link>
                <span className={`text-sm ${menuOpen ? "visible" : "hidden"}`}>
                  Me conheça
                </span>
              </li>
              <li className="flex flex-col justify-center items-center gap-1">
                <Link
                  href=""
                  className="rounded-full overflow-hidden bg-gray-800 p-2 hover:bg-gray-500 text-white hover:text-[#1e90ff] transition-all duration-300"
                >
                  <Brain className="w-6 h-6"></Brain>
                </Link>
                <span className={`text-sm ${menuOpen ? "visible" : "hidden"}`}>
                  Skills
                </span>
              </li>
              <li className="flex flex-col justify-center items-center gap-1">
                <Link
                  href=""
                  className="rounded-full overflow-hidden bg-gray-800 p-2 hover:bg-gray-500 text-white hover:text-[#1e90ff] transition-all duration-300"
                >
                  <Briefcase className="w-6 h-6"></Briefcase>
                </Link>
                <span className={`text-sm ${menuOpen ? "visible" : "hidden"}`}>
                  Experiência
                </span>
              </li>
              <li className="flex flex-col justify-center items-center gap-1">
                <Link
                  href=""
                  className="rounded-full overflow-hidden bg-gray-800 p-2 hover:bg-gray-500 text-white hover:text-[#1e90ff] transition-all duration-300"
                >
                  <Code className="w-6 h-6"></Code>
                </Link>
                <span className={`text-sm ${menuOpen ? "visible" : "hidden"}`}>
                  Projetos
                </span>
              </li>
              <li className="flex flex-col justify-center items-center gap-1">
                <Link
                  href=""
                  className="rounded-full overflow-hidden bg-gray-800 p-2 hover:bg-gray-500 text-white hover:text-[#1e90ff] transition-all duration-300"
                >
                  <PhoneCall className="w-6 h-6"></PhoneCall>
                </Link>
                <span className={`text-sm ${menuOpen ? "visible" : "hidden"}`}>
                  Contato
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
