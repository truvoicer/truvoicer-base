import React, {useContext} from 'react';
import SocialFollowWidget from "@/truvoicer-base/components/widgets/Social/SocialFollowWidget";
import SocialShareWidget from "@/truvoicer-base/components/widgets/Social/SocialShareWidget";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function SocialWidgetInterface(props) {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const {data} = props;

    function getSocialWidget(item) {
        switch (item?.type) {
            case 'follow':
                return <SocialFollowWidget data={item} />;
            case 'share':
                return <SocialShareWidget data={item} />;
            default:
                return null;
        }
    }
    return (
        <div>
            {Array.isArray(data?.types) && data.types.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        {templateManager.render(getSocialWidget(item))}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

SocialWidgetInterface.category = 'widgets';
SocialWidgetInterface.templateId = 'socialWidgetInterface';
export default SocialWidgetInterface;
