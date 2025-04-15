"use client"
import MiniMusicPlayer from "@/components/YoutubeMusicPlayer/MiniMusicPlayer"
import { selectCurrentPlaylist } from "@/store/playlistSlice"
import { useSelector } from "react-redux"


export default function BottomArea() {
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    return (<>
         {currentPlaylist.length && <MiniMusicPlayer songsData={currentPlaylist} />}
    </>)
}