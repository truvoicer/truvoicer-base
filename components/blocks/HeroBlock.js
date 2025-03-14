import React, { useContext } from "react";
import { connect } from "react-redux";
import { itemDataTextFilter } from "../../library/helpers/items";
import { isNotEmpty, isValidImageSrc } from "../../library/utils";
import { getExtraDataValue } from "../../library/helpers/pages";
import { blockComponentsConfig } from "@/truvoicer-base/config/block-components-config";
import { TemplateManager } from "@/truvoicer-base/library/template/TemplateManager";
import { TemplateContext } from "@/truvoicer-base/config/contexts/TemplateContext";
import { AppModalContext } from "@/truvoicer-base/config/contexts/AppModalContext";
import Image from "next/image";

const HeroBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const modalContext = useContext(AppModalContext);
    let heroType = "full";
    function getImageSrc(index) {
        if (!Array.isArray(props?.data?.images)) {
            return null;
        }
        if (!props.data.images.length) {
            return null;
        }
        if (!props.data.images?.[index]?.src) {
            return null;
        }
        return isValidImageSrc(props.data.images[index].src) ? props.data.images[index].src : null;
    }
    const primaryBgUrl = getImageSrc(0) || "/img/banner/banner.png";
    const secondaryBgUrl = getImageSrc(1) || "";
    const breadcrumbBgUrl = getImageSrc(2) || "/img/banner/bradcam.png";
    if (isNotEmpty(props?.data?.hero_type)) {
        heroType = props.data.hero_type;
    }
    const buttonClickHandler = (e) => {
        e.preventDefault();
        modalContext.showModal({
            component: blockComponentsConfig.components.authentication_register.name,
            show: true
        });
    }

    const defaultButtonLabel = "Start Searching";
    const buttonLabel = getExtraDataValue("button_label", props.data?.hero_extra_data);

    return (
        <>
            {heroType === "breadcrumb_hero" &&
                <div
                    className="bradcam_area"
                    style={{ backgroundImage: `url(${breadcrumbBgUrl})` }}
                >
                    <div className="container section-block">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="bradcam_text">
                                    <h3>{itemDataTextFilter(props?.data?.hero_title)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {heroType === "full_hero" &&
                <div className="slider_area">
                    <div
                        className="single_slider  d-flex align-items-center slider_bg_1"
                        style={{ backgroundImage: `url(${primaryBgUrl})` }}
                    >
                        <div className="container section-block">
                            <div className="row align-items-center">
                                <div className="col-lg-7 col-md-6">
                                    <div className="slider_text">
                                        <h5 className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".2s">

                                        </h5>
                                        <h3 className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">
                                            {itemDataTextFilter(props?.data?.hero_title)}
                                        </h3>
                                        <p className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".4s">
                                            {props.data && props.data.hero_text ? props.data.hero_text : ""}
                                        </p>
                                        <div className="sldier_btn wow fadeInLeft" data-wow-duration="1s"
                                            data-wow-delay=".5s">
                                            <a onClick={buttonClickHandler} className="boxed-btn3">
                                                {isNotEmpty(buttonLabel) ? buttonLabel : defaultButtonLabel}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ilstration_img wow fadeInRight d-none d-lg-block text-right" data-wow-duration="1s"
                        data-wow-delay=".2s">
                        {secondaryBgUrl &&
                            <img src={secondaryBgUrl} alt="" />
                        }
                    </div>
                </div>
            }
        </>
    );
}
HeroBlock.category = 'public';
HeroBlock.templateId = 'heroBlock';
function mapStateToProps(state) {
    return {
        item: state.item,
        blocksData: state.page.blocksData
    };
}

export default connect(
    mapStateToProps
)(HeroBlock);
