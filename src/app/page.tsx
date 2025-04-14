import YoutubeMusicPlayer from "@/components/YoutubeMusicPlayer/YoutubeMusicPlayer";
import clsx from "clsx";

export default async function Home() {
  const searchData = await import("../data/serchResults.json");
  return (
    <div className={clsx(['relative', "flex flex-col"])}>
      <h1>R MUsic</h1>
      <YoutubeMusicPlayer videoId="PxJNNAezY0A" songsData={searchData.items}/>
    </div>
  );
}
