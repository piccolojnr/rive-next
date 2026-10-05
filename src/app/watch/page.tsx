"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
  // console.log(params?.get("id"));
  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<any>();
  const [season, setSeason] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [minEpisodes, setMinEpisodes] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(2);
  const [maxSeason, setMaxSeason] = useState(1);
  const [nextSeasonMinEpisodes, setNextSeasonMinEpisodes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchDetails, setWatchDetails] = useState(false);
  const [data, setdata] = useState<any>();
  const [source, setSource] = useState("VIDLINK");
  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  const moreBtn: any = useRef(null);
  if (type === null && params?.get("id") !== null) setType(params?.get("type"));
  if (id === null && params?.get("id") !== null) setId(params?.get("id"));
  if (season === null && params?.get("season") !== null)
    setSeason(params?.get("season"));
  if (episode === null && params?.get("episode") !== null)
    setEpisode(params?.get("episode"));

  useEffect(() => {
    setLoading(true);
    setType(params?.get("type"));
    setId(params?.get("id"));
    setSeason(params?.get("season"));
    setEpisode(params?.get("episode"));
    setContinueWatching({ type: params?.get("type"), id: params?.get("id") });
    const fetch = async () => {
      const res: any = await axiosFetch({ requestID: `${type}Data`, id: id });
      setdata(res);
      setMaxSeason(res?.number_of_seasons);
      const seasonData = await axiosFetch({
        requestID: `tvEpisodes`,
        id: id,
        season: season,
      });
      seasonData?.episodes?.length > 0 &&
        setMaxEpisodes(
          seasonData?.episodes[seasonData?.episodes?.length - 1]
            ?.episode_number,
        );
      setMinEpisodes(seasonData?.episodes[0]?.episode_number);
      if (parseInt(episode) >= maxEpisodes - 1) {
        var nextseasonData = await axiosFetch({
          requestID: `tvEpisodes`,
          id: id,
          season: parseInt(season) + 1,
        });
        nextseasonData?.episodes?.length > 0 &&
          setNextSeasonMinEpisodes(nextseasonData?.episodes[0]?.episode_number);
      }
    };
    if (type === "tv") fetch();

    const handleKeyDown = (event: any) => {
      if (event.shiftKey && event.key === "N") {
        event.preventDefault();
        nextBtn?.current.click();
        // handleForward();
        // console.log("next");
      } else if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        backBtn?.current.click();
        // handleBackward();
        // console.log("prev");
      } else if (event.shiftKey && event.key === "M") {
        event.preventDefault();
        moreBtn?.current.click();
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [params, id, season, episode]);
  useEffect(() => {
    // Personal build: VidLink / VidFast are ad-free, no blocker needed.
    // Fallback sources may show ads.
    if (source !== "VIDLINK" && source !== "VIDFAST") {
      toast.info("Fallback source: use an ad-blocker if you see popups.");
    }
  }, [source]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log({ id });
  //     setLoading(false);
  //   }, 1000);
  // }, [id]);

  // useEffect(() => {
  //   // Override window.open to prevent opening new tabs
  //   window.open = function (url, target, features, replace) {
  //     console.log("window.open is blocked:", url);
  //     return null; // Return null to prevent opening new tabs
  //   };
  // }, [window]);

  function handleBackward() {
    // setEpisode(parseInt(episode)+1);
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    // setEpisode(parseInt(episode)+1);
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  // Personal ad-free setup: hardcoded providers, env overrides allowed.
  // VidLink + VidFast are ad-free / no popups. Others are fallbacks.
  const STREAM_URL_VIDLINK =
    process.env.NEXT_PUBLIC_STREAM_URL_VIDLINK || "https://vidlink.pro";
  const STREAM_URL_VIDFAST =
    process.env.NEXT_PUBLIC_STREAM_URL_VIDFAST || "https://vidfast.pro";
  const STREAM_URL_EMBEDSU =
    process.env.NEXT_PUBLIC_STREAM_URL_EMB || "https://embed.su";
  const STREAM_URL_VIDSRC =
    process.env.NEXT_PUBLIC_STREAM_URL_VID || "https://vidsrc.cc/v2";
  const STREAM_URL_MULTI =
    process.env.NEXT_PUBLIC_STREAM_URL_MULTI || "https://multiembed.mov";
  const STREAM_URL_2EMBED =
    process.env.NEXT_PUBLIC_STREAM_URL_AGG || "https://www.2embed.stream";

  const getSrc = () => {
    if (!id) return "";
    if (type === "movie") {
      switch (source) {
        case "VIDLINK":
          return `${STREAM_URL_VIDLINK}/movie/${id}`;
        case "VIDFAST":
          return `${STREAM_URL_VIDFAST}/movie/${id}?autoPlay=true`;
        case "EMBEDSU":
          return `${STREAM_URL_EMBEDSU}/embed/movie/${id}`;
        case "VIDSRC":
          return `${STREAM_URL_VIDSRC}/embed/movie/${id}`;
        case "MULTI":
          return `${STREAM_URL_MULTI}/?video_id=${id}&tmdb=1`;
        case "TWOEMBED":
          return `${STREAM_URL_2EMBED}/embed/movie/${id}`;
        default:
          return `${STREAM_URL_VIDLINK}/movie/${id}`;
      }
    } else {
      switch (source) {
        case "VIDLINK":
          return `${STREAM_URL_VIDLINK}/tv/${id}/${season}/${episode}`;
        case "VIDFAST":
          return `${STREAM_URL_VIDFAST}/tv/${id}/${season}/${episode}?autoPlay=true&autoNext=true`;
        case "EMBEDSU":
          return `${STREAM_URL_EMBEDSU}/embed/tv/${id}/${season}/${episode}`;
        case "VIDSRC":
          return `${STREAM_URL_VIDSRC}/embed/tv/${id}/${season}/${episode}`;
        case "MULTI":
          return `${STREAM_URL_MULTI}/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
        case "TWOEMBED":
          return `${STREAM_URL_2EMBED}/embed/tv/${id}/${season}/${episode}`;
        default:
          return `${STREAM_URL_VIDLINK}/tv/${id}/${season}/${episode}`;
      }
    }
  };

  return (
    <div className={styles.watch}>
      <div onClick={() => back()} className={styles.backBtn}>
        <IoReturnDownBack
          data-tooltip-id="tooltip"
          data-tooltip-content="go back"
        />
      </div>
      {
        <div className={styles.episodeControl}>
          {type === "tv" ? (
            <>
              <div
                ref={backBtn}
                onClick={() => {
                  if (episode > 1) handleBackward();
                }}
                data-tooltip-id="tooltip"
                data-tooltip-html={
                  episode > minEpisodes
                    ? "<div>Previous episode <span class='tooltip-btn'>SHIFT + P</span></div>"
                    : `Start of season ${season}`
                }
              >
                <FaBackwardStep
                  className={`${episode <= minEpisodes ? styles.inactive : null}`}
                />
              </div>
              <div
                ref={nextBtn}
                onClick={() => {
                  if (
                    episode < maxEpisodes ||
                    parseInt(season) + 1 <= maxSeason
                  )
                    handleForward();
                }}
                data-tooltip-id="tooltip"
                data-tooltip-html={
                  episode < maxEpisodes
                    ? "<div>Next episode <span class='tooltip-btn'>SHIFT + N</span></div>"
                    : parseInt(season) + 1 <= maxSeason
                      ? `<div>Start season ${parseInt(season) + 1} <span class='tooltip-btn'>SHIFT + N</span></div>`
                      : `End of season ${season}`
                }
              >
                <FaForwardStep
                  className={`${episode >= maxEpisodes && season >= maxSeason ? styles.inactive : null} ${episode >= maxEpisodes && season < maxSeason ? styles.nextSeason : null}`}
                />
              </div>
            </>
          ) : null}
          <div
            ref={moreBtn}
            onClick={() => setWatchDetails(!watchDetails)}
            data-tooltip-id="tooltip"
            data-tooltip-html={
              !watchDetails
                ? "More <span class='tooltip-btn'>SHIFT + M</span></div>"
                : "close <span class='tooltip-btn'>SHIFT + M</span></div>"
            }
          >
            {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
          </div>
        </div>
      }
      {watchDetails && (
        <WatchDetails
          id={id}
          type={type}
          data={data}
          season={season}
          episode={episode}
          setWatchDetails={setWatchDetails}
        />
      )}
      <select
        name="source"
        id="source"
        className={styles.source}
        value={source}
        onChange={(e) => setSource(e.target.value)}
      >
        <option value="VIDLINK">VidLink (Ad-free, Recommended)</option>
        <option value="VIDFAST">VidFast (Ad-free, Auto-Next)</option>
        <option value="EMBEDSU">Embed.su (Fallback)</option>
        <option value="VIDSRC">VidSrc.cc (Fallback)</option>
        <option value="MULTI">MultiEmbed (Fallback)</option>
        <option value="TWOEMBED">2Embed (Fallback)</option>
      </select>
      <div className={`${styles.loader} skeleton`}></div>

      {id !== "" && id != null ? (
        <iframe
          key={source + id + season + episode}
          scrolling="no"
          src={getSrc()}
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      ) : null}
    </div>
  );
};

export default Watch;
