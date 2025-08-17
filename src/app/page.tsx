import { Header } from "../../components/header";
import { HomePage } from "../../components/home/home-page";

export default function Home() {
  return (
    <div className="font-sans flex flex-col justify-start items-center">
      <Header />
      <main className="w-full flex flex-col justify-center items-center pt-32">
        <HomePage />
      </main>
    </div>
  );
}
