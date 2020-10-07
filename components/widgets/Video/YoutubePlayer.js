import React, {useState} from "react";

const YoutubePlayer = (props) => {
    const [video, setVideo] = useState(null);
    const [showVideo, setShowVideo] = useState(false);

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
            <div className={"youtube-player thumbnail"} style={{backgroundImage: "url(https://img.youtube.com/vi/" + props.video_id + "/default.jpg)"}}>

                {showVideo
                    ?
                    video
                    :
                <div className="play-btn">
                    <a onClick={getVideo}
                       className="play-button">
                        <img src="/img/play.png" alt=""/>
                    </a>
                </div>
                }
            </div>
    )
}
export default YoutubePlayer;