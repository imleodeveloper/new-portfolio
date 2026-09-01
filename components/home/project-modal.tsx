"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink, Code, Smartphone, Monitor } from "lucide-react";
import { Modal } from "../ui/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  stacks?: string[];
  url: string;
  logo: string;
  images?: string[];
  mobileImages?: string[];
  inDevelopment?: boolean;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
}

const STACK_ICONS: Record<string, string> = {
  "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "TailwindCSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "PHP": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  "Supabase": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
  "Vercel": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
  "React (Vite)": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
};

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");

  if (!project) return null;

  const desktopSlides = project.images?.length ? project.images : [project.logo];
  const mobileSlides  = project.mobileImages?.length ? project.mobileImages : desktopSlides;
  const slides = aspectRatio === "9:16" ? mobileSlides : desktopSlides;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[95vw] 2xl:max-w-[85vw]">
      <div className="relative w-full h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
        {/* Close Button overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>

        {/* Aspect Ratio Toggle */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <button
            onClick={() => setAspectRatio("16:9")}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2 text-xs font-bold ${
              aspectRatio === "16:9"
                ? "bg-blue-600 text-white"
                : "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20"
            }`}
            aria-label="Desktop View"
          >
            <Monitor className="w-4 h-4" /> <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setAspectRatio("9:16")}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2 text-xs font-bold ${
              aspectRatio === "9:16"
                ? "bg-blue-600 text-white"
                : "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20"
            }`}
            aria-label="Mobile View"
          >
            <Smartphone className="w-4 h-4" /> <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        <div
          className={`grid grid-cols-1 ${
            aspectRatio === "16:9"
              ? "lg:grid-cols-[2fr_1.5fr]"
              : "lg:grid-cols-[1fr_2fr]"
          } h-full min-h-[500px] transition-all duration-700`}
        >
          {/* LEFT: Swiper Carousel */}
          <div className="relative w-full h-full min-h-[300px] lg:min-h-[600px] flex items-center justify-center bg-gray-100 dark:bg-black overflow-hidden p-4 sm:p-8">
            <div
              className={`relative overflow-hidden flex items-center justify-center transition-all duration-700 w-full ${
                aspectRatio === "16:9"
                  ? "aspect-video max-w-full"
                  : "aspect-[9/16] max-w-[360px]"
              }`}
            >
              <Swiper
              grabCursor={true}
              effect={"creative"}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: ["-120%", 0, -500],
                },
                next: {
                  shadow: true,
                  translate: ["120%", 0, -500],
                },
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              modules={[EffectCreative, Pagination, Autoplay]}
              className="w-full h-full"
            >
              {slides.map((src, idx) => (
                <SwiperSlide
                  key={idx}
                  className="w-full h-full flex items-center justify-center p-0 m-0 bg-gray-950"
                >
                  <div className="w-full h-full relative">
                    <Image
                      src={src}
                      alt={`${project.name} screenshot ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="p-8 flex flex-col justify-center gap-6 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {project.name}
                </h2>
                {project.inDevelopment && (
                  <span className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold rounded-full uppercase tracking-wider">
                    Em Desenv.
                  </span>
                )}
              </div>
              <div className="w-12 h-1 bg-blue-600 rounded-full mb-4"></div>
              
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {project.description}
                </p>
                {project.detailedDescription && (
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm italic border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                    {project.detailedDescription}
                  </p>
                )}
              </div>
            </div>

            {project.stacks && project.stacks.length > 0 && (
              <div className="w-full overflow-hidden mt-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                  Tecnologias Utilizadas
                </h3>
                {/* Infinite Marquee Wrapper */}
                <div className="w-full overflow-hidden mask-image-gradient">
                  <div className="animate-marquee-left flex items-center gap-6 py-2">
                    {/* Double the list to make infinite scroll seamless */}
                    {[...project.stacks, ...project.stacks].map((stack, idx) => (
                      <div
                        key={`${stack}-${idx}`}
                        className="flex items-center gap-2 whitespace-nowrap bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl shadow-sm"
                      >
                        {STACK_ICONS[stack] ? (
                          <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                              src={STACK_ICONS[stack]}
                              alt={stack}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Code className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        )}
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {stack}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Acessar Projeto
              </h3>
              <Link
                href={`https://${project.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-xl"
              >
                Visitar Site <ExternalLink className="w-4 h-4" />
              </Link>
              <p className="text-xs text-center text-gray-500 mt-2">
                {project.url}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
