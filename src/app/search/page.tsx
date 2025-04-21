import SongCard from "@/components/common/SongCards/SongCard";
import defaultConfig from "@/config/defaut";
import clsx from "clsx";
import { SearchResultUnofficial, Song } from "@/types/song";

const { serverUrl } = defaultConfig;

interface SearchPageProps {
    searchParams: {
        q: string;
    };
}

export default async function SearchPage(props: SearchPageProps) {
    const { searchParams } = props;
    const { q: query } = await searchParams;
    const response = await fetch(`${serverUrl}/search-scrap?q=${query}`);
    const searchResults: SearchResultUnofficial = (await response.json()) || [];

    const songSearchData: Song[] = searchResults.songResults?.map(
        (songData) => {
            return {
                videoId: songData.videoId,
                thumbnail: songData.thumbnails[0],
                channelTitle: songData.artist.name,
                title: songData.name,
            };
        }
    );
    return (
        <>
            <section className={clsx(["w-full", "flex-1 flex flex-col items-center", "overflow-y-scroll"])}>
                <div className={clsx(["w-full sm:w-1/2 max-w-lg px-4"])}>
                {songSearchData.length > 0 &&
                    songSearchData.map((songData) => (
                        <SongCard key={songData.videoId} data={songData} />
                    ))}

                </div>
            </section>
        </>
    );
}
