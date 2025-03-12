import Link from "next/link";
import { useContext } from "react";

const { ListingsContext } = require("@/truvoicer-base/library/listings/contexts/ListingsContext");
const { SearchContext } = require("@/truvoicer-base/library/listings/contexts/SearchContext");
const { ListingsManager } = require("@/truvoicer-base/library/listings/listings-manager");

function Thumbnail({ type, value, data = null, linkProps = {}, imgStyle = {} }) {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    return (
        <>
            {type === 'data_key' &&
                <div className="post-thumb">
                    <Link {...linkProps}>
                        <img className="img-fluid"
                            style={{...listingsManager.getThumbnailImgStyle(data), ...imgStyle}}
                            src={value ? value : "/img/pticon.png"} alt="" />
                    </Link>
                </div>
            }
            {type === 'bg' &&
                // <div>
                <Link {...linkProps}
                    className="post-thumb"
                    style={{
                        ...listingsManager.getThumbnailImgStyle(data),
                    ...imgStyle,
                        backgroundColor: value || '#eeeeee'
                    }}>

                </Link>
                // </div>
            }
            {type === 'image' &&
                <div className="post-thumb">
                    <Link {...linkProps}>
                        <img className="img-fluid"
                            style={{...listingsManager.getThumbnailImgStyle(data), ...imgStyle}}
                            src={value ? value : "/img/pticon.png"} alt="" />
                    </Link>
                </div>
            }
        </>
    );
}

export default Thumbnail;