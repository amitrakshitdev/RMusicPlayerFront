"use client"
import { changePlaylist } from "@/store/playlistSlice";
import { Song } from "@/types/song";
import clsx from "clsx";
import Link from "next/link";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  import("@/data/serchResults.json").then(data => {
    const defaultPlaylist : Song[]= data.items.map((song)=>{
      return {
        videoId: song.id.videoId,
        title: song.snippet.title,
        channelTitle: song.snippet.channelTitle,
        thumbnail: song.snippet.thumbnails.high
      }
    });
    dispatch(changePlaylist(defaultPlaylist));
  });

  return (
    <div className={clsx(['relative', "flex flex-col"])}>
      <h1>R MUsic Home</h1>
      <Link href={"/watch"}>Watch Page</Link>
    </div>
  );
}
