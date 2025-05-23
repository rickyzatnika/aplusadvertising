import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen relative">
      <Image src="/under.png" alt="under-construction" fill objectFit="contain" priority={true} />
    </div>
  );
}
