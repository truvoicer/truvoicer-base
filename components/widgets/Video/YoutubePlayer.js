import React, {useContext, useState} from "react";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Image from "next/image";

const YoutubePlayer = (props) => {
    const [video, setVideo] = useState(null);
    const [showVideo, setShowVideo] = useState(false);

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getVideo = (e) => {
        e.preventDefault();
        setVideo(
            <iframe src={"https://www.youtube.com/embed/" + props.video_id}
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                    title='video'

            />
        )
        setShowVideo(true)
    }


        return (
            <div className={"youtube-player thumbnail"}
                 style={{backgroundImage: "url(https://img.youtube.com/vi/" + props.video_id + "/default.jpg)"}}>

                {showVideo
                    ?
                    video
                    :
                    <div className="play-btn">
                        <a onClick={getVideo}
                           className="play-button">
                            <img   src="/img/play.png" alt=""/>
                        </a>
                    </div>
                }
            </div>
        );
}
YoutubePlayer.category = 'media';
YoutubePlayer.templateId = 'youtubePlayer';
export default YoutubePlayer;
