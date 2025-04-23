import SongCard from "@/components/common/SongCards/SongCard";
import defaultConfig from "@/config/defaut";
import clsx from "clsx";
import { SearchResultUnofficial, Song } from "@/types/song";
const { serverUrl } = defaultConfig;

type SearchPageProps = {
    searchParams: Promise<{ q: string }>;
};

export default async function SearchPage(props: SearchPageProps) {
    const { searchParams } = props;
    const { q: query } = await searchParams;
    if (!query) {
        return (
            <h1 className={clsx(["text-center text-xl"])}>
                No Search Results.
            </h1>
        );
    }

    const response = await fetch(`${serverUrl}/search-scrap?q=${query}`);

    if (!response.ok) {
        return (
            <h1 className={clsx(["text-center text-xl"])}>
                There was some error. Sorry for inconvenience. Please try again
                later.
            </h1>
        );
    }

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
            <section
                className={clsx([
                    "absolute",
                    "w-full h-full",
                    "pb-20",
                    "flex-1 flex flex-col items-center",
                    "overflow-y-scroll",
                    "focus-visible:outline-0",
                ])}
            >
                <div className={clsx(["w-full sm:w-1/2 max-w-lg px-4"])}>
                    {songSearchData.length > 0 &&
                        songSearchData.map((songData, idx) => (
                            <SongCard
                                key={songData.videoId + idx}
                                data={songData}
                            />
                        ))}
                </div>
            </section>
        </>
    );
}
